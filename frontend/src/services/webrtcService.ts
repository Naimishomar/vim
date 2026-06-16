import { socketService } from './socketService';

export type MediaErrorCode = 'not-supported' | 'permission-denied' | 'not-found' | 'in-use' | 'unknown';

// In production (served by the backend), we use relative paths ('').
// In development, we connect to the local Vite proxy or backend directly.
const BACKEND_URL = import.meta.env.PROD ? '' : (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000');

function parseMediaError(err: unknown): MediaErrorCode {
  if (err instanceof DOMException) {
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') return 'permission-denied';
    if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') return 'not-found';
    if (err.name === 'NotReadableError' || err.name === 'TrackStartError') return 'in-use';
  }
  return 'unknown';
}

export function attachStreamToVideo(video: HTMLVideoElement | null, stream: MediaStream | null) {
  if (!video || !stream) return;
  video.srcObject = stream;
  void video.play().catch(() => {});
}

class WebRTCService {
  public peerConnection: RTCPeerConnection | null = null;
  public localStream: MediaStream | null = null;
  public remoteStream: MediaStream | null = null;

  public cfSessionId: string | null = null;
  private peerSocketId: string | null = null;
  private onRemoteStreamCallback: ((stream: MediaStream) => void) | null = null;

  isMediaSupported(): boolean {
    return !!(navigator.mediaDevices?.getUserMedia);
  }

  async startLocalStream(videoEnabled: boolean, resolution: '480' | '720' | '1080' = '480'): Promise<{ stream: MediaStream | null; error: MediaErrorCode | null }> {
    if (!this.isMediaSupported()) {
      return { stream: null, error: 'not-supported' };
    }

    if (this.localStream) {
      this.localStream.getTracks().forEach((t) => t.stop());
      this.localStream = null;
    }

    let idealWidth = 640;
    let idealHeight = 480;
    if (resolution === '720') {
      idealWidth = 1280;
      idealHeight = 720;
    } else if (resolution === '1080') {
      idealWidth = 1920;
      idealHeight = 1080;
    }

    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: videoEnabled
          ? { width: { ideal: idealWidth }, height: { ideal: idealHeight }, facingMode: 'user' }
          : false,
        audio: true,
      });
      return { stream: this.localStream, error: null };
    } catch (err) {
      console.error('Camera/mic access denied or unavailable:', err);
      return { stream: null, error: parseMediaError(err) };
    }
  }

  async initialize(
    peerSocketId: string,
    videoEnabled: boolean,
    onRemoteStream: (stream: MediaStream) => void,
    resolution: '480' | '720' | '1080' = '480'
  ): Promise<{ ok: boolean; error?: string }> {
    try {
      this.peerSocketId = peerSocketId;
      this.onRemoteStreamCallback = onRemoteStream;

      if (!this.localStream) {
        const { stream, error } = await this.startLocalStream(videoEnabled, resolution);
        if (!stream) {
          console.error('Failed to start local stream:', error);
          return { ok: false, error: error || 'unknown' };
        }
      }

      this.remoteStream = new MediaStream();
      this.peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.cloudflare.com:3478' }] // CF handles ICE
      });

      this.peerConnection.ontrack = (event) => {
        const stream = event.streams[0] ?? this.remoteStream!;
        stream.getTracks().forEach((track) => {
          if (!this.remoteStream!.getTracks().some((t) => t.id === track.id)) {
            this.remoteStream!.addTrack(track);
          }
        });
        this.onRemoteStreamCallback?.(this.remoteStream!);
      };

      const tracksPayload: any[] = [];
      const transceivers: any[] = [];

      if (this.localStream) {
        for (const track of this.localStream.getTracks()) {
          const tc = this.peerConnection.addTransceiver(track, { direction: 'sendonly' });
          transceivers.push({ tc, track });
        }
      } else {
        // Fallback: add empty transceivers to generate valid SDP if no local media is available yet
        this.peerConnection.addTransceiver('video', { direction: 'recvonly' });
        this.peerConnection.addTransceiver('audio', { direction: 'recvonly' });
      }

      // Create Cloudflare Session
      const currentPc = this.peerConnection;
      const offer = await currentPc.createOffer();
      if (this.peerConnection !== currentPc) return { ok: false, error: 'Connection changed' };
      await currentPc.setLocalDescription(offer);
      if (this.peerConnection !== currentPc) return { ok: false, error: 'Connection changed' };

      const res = await fetch(`${BACKEND_URL}/api/webrtc/sessions/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionDescription: {
          type: offer.type,
          sdp: offer.sdp
        }})
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('Failed to create CF session', text);
        return { ok: false, error: 'CF_API_ERROR: ' + text };
      }

      const data = await res.json();
      this.cfSessionId = data.sessionId;
      
      if (this.peerConnection !== currentPc) return { ok: false, error: 'Peer connection closed' };
      
      await currentPc.setRemoteDescription(new RTCSessionDescription(data.sessionDescription));

      // If we added actual local tracks, we must push them to Cloudflare using tracks/new
      if (this.localStream && transceivers.length > 0) {
        for (const { tc, track } of transceivers) {
          tracksPayload.push({
            location: 'local',
            mid: tc.mid,
            trackName: `vibe-${socketService.socket?.id}-${track.kind}`
          });
        }

        const trackRes = await fetch(`${BACKEND_URL}/api/webrtc/sessions/${this.cfSessionId}/tracks/new`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionDescription: {
              type: offer.type,
              sdp: offer.sdp
            },
            tracks: tracksPayload
          })
        });

        if (this.peerConnection !== currentPc) return { ok: false, error: 'Connection changed' };

        if (!trackRes.ok) {
          const text = await trackRes.text();
          console.error('Failed to push tracks', text);
          return { ok: false, error: 'CF_TRACKS_ERROR: ' + text };
        } else {
          // We used the exact same SDP offer as sessions/new, so we are already in 'stable' state.
          // Cloudflare's answer is identical to the one we already applied, so no need to setRemoteDescription here.
          
          // Share tracks with peer in a single batch
          socketService.emit('share-tracks', {
            peerSocketId: this.peerSocketId,
            sessionId: this.cfSessionId,
            tracks: tracksPayload.map(t => t.trackName)
          });
        }
      }

      return { ok: true };
    } catch (error) {
      console.error('WebRTC initialization error:', error);
      return { ok: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  async pullTracks(peerCfSessionId: string, trackNames: string[]) {
    const currentPc = this.peerConnection;
    if (!currentPc || !this.cfSessionId) return;

    const tracksPayload: any[] = [];

    for (const trackName of trackNames) {
      const kind = trackName.includes('video') ? 'video' : 'audio';
      const tc = currentPc.addTransceiver(kind, { direction: 'recvonly' });
      tracksPayload.push({
        location: 'remote',
        sessionId: peerCfSessionId,
        trackName: trackName,
        // Wait until we have mid after setLocalDescription
        tc: tc
      });
    }

    const offer = await currentPc.createOffer();
    if (this.peerConnection !== currentPc) return;
    await currentPc.setLocalDescription(offer);
    if (this.peerConnection !== currentPc) return;

    const res = await fetch(`${BACKEND_URL}/api/webrtc/sessions/${this.cfSessionId}/tracks/new`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionDescription: {
          type: offer.type,
          sdp: offer.sdp
        },
        tracks: tracksPayload.map(t => ({
          location: t.location,
          sessionId: t.sessionId,
          trackName: t.trackName,
          mid: t.tc.mid
        }))
      })
    });

    if (this.peerConnection !== currentPc) return;

    if (!res.ok) {
      console.error('Failed to pull tracks', await res.text());
      return;
    }

    const data = await res.json();
    if (this.peerConnection !== currentPc) return;
    if (data.sessionDescription) {
      await currentPc.setRemoteDescription(new RTCSessionDescription(data.sessionDescription));
    }
  }

  async setVideoEnabled(enabled: boolean, resolution: '480' | '720' | '1080' = '480'): Promise<boolean> {
    if (!this.localStream) return false;

    const videoTracks = this.localStream.getVideoTracks();
    if (enabled) {
      if (videoTracks.length > 0) {
        videoTracks.forEach((t) => { t.enabled = true; });
        return true;
      }

      try {
        let idealWidth = 640;
        let idealHeight = 480;
        if (resolution === '720') {
          idealWidth = 1280;
          idealHeight = 720;
        } else if (resolution === '1080') {
          idealWidth = 1920;
          idealHeight = 1080;
        }

        const videoStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: idealWidth }, height: { ideal: idealHeight }, facingMode: 'user' },
        });
        const videoTrack = videoStream.getVideoTracks()[0];
        this.localStream.addTrack(videoTrack);
        
        // Push the new track manually
        const currentPc = this.peerConnection;
        if (currentPc && this.cfSessionId) {
          const tc = currentPc.addTransceiver(videoTrack, { direction: 'sendonly' });
          const offer = await currentPc.createOffer();
          if (this.peerConnection !== currentPc) return false;
          await currentPc.setLocalDescription(offer);
          if (this.peerConnection !== currentPc) return false;
          
          const trackName = `vibe-${socketService.socket?.id}-${videoTrack.kind}`;
          const trackRes = await fetch(`${BACKEND_URL}/api/webrtc/sessions/${this.cfSessionId}/tracks/new`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionDescription: {
                type: offer.type,
                sdp: offer.sdp
              },
              tracks: [{ location: 'local', mid: tc.mid, trackName }]
            })
          });
          
          if (this.peerConnection !== currentPc) return false;

          if (trackRes.ok) {
            const trackData = await trackRes.json();
            if (this.peerConnection !== currentPc) return false;
            if (trackData.sessionDescription) {
              await currentPc.setRemoteDescription(new RTCSessionDescription(trackData.sessionDescription));
            }
            socketService.emit('share-tracks', {
              peerSocketId: this.peerSocketId,
              sessionId: this.cfSessionId,
              tracks: [trackName]
            });
          }
        }
        
        return true;
      } catch (err) {
        console.error('Failed to re-enable camera:', err);
        return false;
      }
    }

    videoTracks.forEach((t) => { t.enabled = false; });
    return true;
  }

  endPeerConnection() {
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    this.remoteStream = null;
    this.peerSocketId = null;
    this.cfSessionId = null;
    this.onRemoteStreamCallback = null;
  }

  endCall() {
    if (this.localStream) {
      this.localStream.getTracks().forEach((t) => t.stop());
      this.localStream = null;
    }
    this.endPeerConnection();
  }
}

export const webrtcService = new WebRTCService();
