'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import SimplePeer from 'simple-peer';
import { ICE_SERVERS } from '@/lib/webrtc-config';
import { CONSTANTS } from '@/lib/constants';
import { useRoomStore } from '@/store/roomStore';

const { SOCKET_EVENTS } = CONSTANTS;

/**
 * useWebRTC — manages simple-peer instances and WebRTC signaling.
 * Handles full mesh topology with ICE restart on failure.
 */
export function useWebRTC(socket, localStream, roomId, userId) {
  const peersRef = useRef({}); // socketId → Peer instance
  const [remoteStreams, setRemoteStreams] = useState([]);
  const { setParticipants } = useRoomStore();

  const createPeer = useCallback(
    (targetSocketId, initiator) => {
      if (!localStream) return null;

      const peer = new SimplePeer({
        initiator,
        trickle: true,
        stream: localStream,
        config: ICE_SERVERS,
      });

      peer.on('signal', (signal) => {
        if (!socket) return;
        if (signal.type === 'offer') {
          socket.emit(SOCKET_EVENTS.WEBRTC_OFFER, {
            targetSocketId,
            offer: signal,
            fromSocketId: socket.id,
          });
        } else if (signal.type === 'answer') {
          socket.emit(SOCKET_EVENTS.WEBRTC_ANSWER, {
            targetSocketId,
            answer: signal,
            fromSocketId: socket.id,
          });
        } else {
          socket.emit(SOCKET_EVENTS.WEBRTC_ICE, {
            targetSocketId,
            candidate: signal,
          });
        }
      });

      peer.on('stream', (remoteStream) => {
        setRemoteStreams((prev) => {
          const filtered = prev.filter((s) => s.socketId !== targetSocketId);
          return [...filtered, { socketId: targetSocketId, stream: remoteStream, user: { name: 'Participant' } }];
        });
      });

      peer.on('error', (err) => {
        if (err.code === 'ERR_ICE_CONNECTION_FAILURE') {
          // Attempt ICE restart
          try { peer.restartIce?.(); } catch { destroyPeer(targetSocketId); }
        }
      });

      peer.on('close', () => {
        destroyPeer(targetSocketId);
      });

      return peer;
    },
    [localStream, socket]
  );

  const destroyPeer = useCallback((socketId) => {
    const peer = peersRef.current[socketId];
    if (peer) {
      peer.destroy();
      delete peersRef.current[socketId];
      setRemoteStreams((prev) => prev.filter((s) => s.socketId !== socketId));
    }
  }, []);

  useEffect(() => {
    if (!socket || !localStream) return;

    const handleParticipantJoined = ({ socketId }) => {
      if (socketId === socket.id) return;
      if (peersRef.current[socketId]) return;
      const peer = createPeer(socketId, true);
      if (peer) peersRef.current[socketId] = peer;
    };

    const handleOffer = ({ offer, fromSocketId }) => {
      if (peersRef.current[fromSocketId]) return;
      const peer = createPeer(fromSocketId, false);
      if (!peer) return;
      peersRef.current[fromSocketId] = peer;
      peer.signal(offer);
    };

    const handleAnswer = ({ answer, fromSocketId }) => {
      const peer = peersRef.current[fromSocketId];
      if (peer) peer.signal(answer);
    };

    const handleIce = ({ candidate, fromSocketId }) => {
      const peer = peersRef.current[fromSocketId];
      if (peer) peer.signal(candidate);
    };

    const handleParticipantLeft = ({ socketId }) => {
      destroyPeer(socketId);
    };

    socket.on(SOCKET_EVENTS.PARTICIPANT_JOINED, handleParticipantJoined);
    socket.on(SOCKET_EVENTS.WEBRTC_OFFER, handleOffer);
    socket.on(SOCKET_EVENTS.WEBRTC_ANSWER, handleAnswer);
    socket.on(SOCKET_EVENTS.WEBRTC_ICE, handleIce);
    socket.on(SOCKET_EVENTS.PARTICIPANT_LEFT, handleParticipantLeft);

    return () => {
      socket.off(SOCKET_EVENTS.PARTICIPANT_JOINED, handleParticipantJoined);
      socket.off(SOCKET_EVENTS.WEBRTC_OFFER, handleOffer);
      socket.off(SOCKET_EVENTS.WEBRTC_ANSWER, handleAnswer);
      socket.off(SOCKET_EVENTS.WEBRTC_ICE, handleIce);
      socket.off(SOCKET_EVENTS.PARTICIPANT_LEFT, handleParticipantLeft);
      // Clean up all peers
      Object.keys(peersRef.current).forEach(destroyPeer);
    };
  }, [socket, localStream, createPeer, destroyPeer]);

  return { peers: peersRef.current, remoteStreams };
}
