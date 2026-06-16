"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../server");
server_1.io.on('connection', (socket) => {
    socket.on('webrtc-offer', (data) => {
        const { peerSocketId, offer } = data;
        server_1.io.to(peerSocketId).emit('webrtc-offer', { peerSocketId: socket.id, offer });
    });
    socket.on('webrtc-answer', (data) => {
        const { peerSocketId, answer } = data;
        server_1.io.to(peerSocketId).emit('webrtc-answer', { peerSocketId: socket.id, answer });
    });
    socket.on('webrtc-ice-candidate', (data) => {
        const { peerSocketId, candidate } = data;
        server_1.io.to(peerSocketId).emit('webrtc-ice-candidate', { peerSocketId: socket.id, candidate });
    });
    // Legacy Cloudflare track sharing (kept for backwards compatibility)
    socket.on('share-track', (data) => {
        const { peerSocketId, trackName, trackId } = data;
        server_1.io.to(peerSocketId).emit('receive-track', {
            peerSocketId: socket.id,
            trackName,
            trackId,
        });
    });
    socket.on('share-tracks', (data) => {
        const { peerSocketId, tracks, sessionId } = data;
        server_1.io.to(peerSocketId).emit('receive-tracks', {
            peerSocketId: socket.id,
            tracks,
            sessionId,
        });
    });
});
//# sourceMappingURL=webrtc.js.map