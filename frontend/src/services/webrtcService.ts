import { socketService } from './socketService';

export type MediaErrorCode = 'not-supported' | 'permission-denied' | 'not-found' | 'unknown';

const ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.cloudflare.com:3478' },
  { urls: 'stun:stun.l.google.com:19302' },
];

function parseMediaError(err: unknown): MediaErrorCode {
  if (err instanceof DOMException) {
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') return 'permission-denied';
    if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') return 'not-found';
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

  private peerSocketId: string | null = null;
  private pendingCandidates: RTCIceCandidateInit[] = [];
  private remoteDescriptionSet = false;

  isMediaSupported(): boolean {
    return !!(navigator.mediaDevices?.getUserMedia);
  }

  async startLocalStream(videoEnabled: boolean): Promise<{ stream: MediaStream | null; error: MediaErrorCode | null }> {
    if (!this.isMediaSupported()) {
      return { stream: null, error: 'not-supported' };
    }

    if (this.localStream) {
      this.localStream.getTracks().forEach((t) => t.stop());
      this.localStream = null;
    }

    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: videoEnabled
          ? { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
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
    isInitiator: boolean,
    peerSocketId: string,
    videoEnabled: boolean,
    onRemoteStream: (stream: MediaStream) => void,
  ): Promise<boolean> {
    try {
      this.peerSocketId = peerSocketId;

      if (!this.localStream) {
        const { stream, error } = await this.startLocalStream(videoEnabled);
        if (!stream) {
          console.error('Failed to start local stream:', error);
          return false;
        }
      }

      // Initiator creates the peer connection and sends an offer.
      // Non-initiator waits for handleOffer to set up the connection.
      if (isInitiator) {
        this.setupPeerConnection(onRemoteStream);
        await this.createAndSendOffer();
      }

      return true;
    } catch (error) {
      console.error('WebRTC initialization error:', error);
      return false;
    }
  }

  private setupPeerConnection(onRemoteStream: (stream: MediaStream) => void) {
    this.endPeerConnection();

    this.peerConnection = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    this.remoteStream = new MediaStream();
    this.pendingCandidates = [];
    this.remoteDescriptionSet = false;

    this.localStream?.getTracks().forEach((track) => {
      this.peerConnection!.addTrack(track, this.localStream!);
    });

    this.peerConnection.ontrack = (event) => {
      const stream = event.streams[0] ?? this.remoteStream!;
      stream.getTracks().forEach((track) => {
        if (!this.remoteStream!.getTracks().some((t) => t.id === track.id)) {
          this.remoteStream!.addTrack(track);
        }
      });
      onRemoteStream(this.remoteStream!);
    };

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate && this.peerSocketId) {
        socketService.emit('webrtc-ice-candidate', {
          peerSocketId: this.peerSocketId,
          candidate: event.candidate.toJSON(),
        });
      }
    };
  }

  private async createAndSendOffer() {
    if (!this.peerConnection || !this.peerSocketId) return;

    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    socketService.emit('webrtc-offer', {
      peerSocketId: this.peerSocketId,
      offer: this.peerConnection.localDescription,
    });
  }

  private async flushPendingCandidates() {
    if (!this.peerConnection || !this.remoteDescriptionSet) return;

    for (const candidate of this.pendingCandidates) {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }
    this.pendingCandidates = [];
  }

  async handleOffer(offer: RTCSessionDescriptionInit, peerSocketId: string, onRemoteStream: (stream: MediaStream) => void) {
    if (!this.localStream) {
      const { stream } = await this.startLocalStream(true);
      if (!stream) return;
    }

    if (!this.peerConnection) {
      this.peerSocketId = peerSocketId;
      this.setupPeerConnection(onRemoteStream);
    }

    if (!this.peerConnection) return;

    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    this.remoteDescriptionSet = true;
    await this.flushPendingCandidates();

    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    socketService.emit('webrtc-answer', {
      peerSocketId,
      answer: this.peerConnection.localDescription,
    });
  }

  async handleAnswer(answer: RTCSessionDescriptionInit) {
    if (!this.peerConnection) return;

    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    this.remoteDescriptionSet = true;
    await this.flushPendingCandidates();
  }

  async handleIceCandidate(candidate: RTCIceCandidateInit) {
    if (!this.peerConnection) return;

    if (this.remoteDescriptionSet) {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } else {
      this.pendingCandidates.push(candidate);
    }
  }

  async setVideoEnabled(enabled: boolean): Promise<boolean> {
    if (!this.localStream) return false;

    const videoTracks = this.localStream.getVideoTracks();
    if (enabled) {
      if (videoTracks.length > 0) {
        videoTracks.forEach((t) => { t.enabled = true; });
        return true;
      }

      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        });
        const videoTrack = videoStream.getVideoTracks()[0];
        this.localStream.addTrack(videoTrack);
        this.peerConnection?.addTrack(videoTrack, this.localStream);
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
    this.pendingCandidates = [];
    this.remoteDescriptionSet = false;
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
