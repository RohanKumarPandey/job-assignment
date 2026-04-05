'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getSocket, destroySocket } from '@/lib/socket';
import { useRoomStore } from '@/store/roomStore';
import { CONSTANTS } from '@/lib/constants';
import { toast } from 'sonner';

const { SOCKET_EVENTS } = CONSTANTS;

/**
 * useSocket — manages Socket.IO connection lifecycle for a room.
 */
export function useSocket(roomId, userId, userName, userAvatar) {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const { setParticipants, addParticipant, removeParticipant } = useRoomStore();

  useEffect(() => {
    if (!roomId || !userId) return;

    const socket = getSocket();
    socketRef.current = socket;

    if (!socket.connected) socket.connect();

    const handleConnect = () => {
      setConnected(true);
      socket.emit(SOCKET_EVENTS.ROOM_JOIN, {
        roomId,
        userId,
        userName: userName ?? 'User',
        userAvatar: userAvatar ?? null,
        role: 'participant',
      });
    };

    const handleDisconnect = () => {
      setConnected(false);
    };

    const handleError = (err) => {
      toast.error(err?.message ?? 'Connection error');
    };

    const handleRoomFull = () => {
      toast.error('Room is full');
    };

    const handleParticipantJoined = (participant) => {
      addParticipant(participant);
    };

    const handleParticipantLeft = ({ userId: leftUserId }) => {
      removeParticipant(leftUserId);
    };

    const handleParticipantList = ({ participants }) => {
      setParticipants(participants);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('error', handleError);
    socket.on(SOCKET_EVENTS.ROOM_FULL, handleRoomFull);
    socket.on(SOCKET_EVENTS.PARTICIPANT_JOINED, handleParticipantJoined);
    socket.on(SOCKET_EVENTS.PARTICIPANT_LEFT, handleParticipantLeft);
    socket.on(SOCKET_EVENTS.PARTICIPANT_LIST, handleParticipantList);

    if (socket.connected) handleConnect();

    return () => {
      socket.emit(SOCKET_EVENTS.ROOM_LEAVE, { roomId, userId });
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('error', handleError);
      socket.off(SOCKET_EVENTS.ROOM_FULL, handleRoomFull);
      socket.off(SOCKET_EVENTS.PARTICIPANT_JOINED, handleParticipantJoined);
      socket.off(SOCKET_EVENTS.PARTICIPANT_LEFT, handleParticipantLeft);
      socket.off(SOCKET_EVENTS.PARTICIPANT_LIST, handleParticipantList);
      destroySocket();
    };
  }, [roomId, userId]);

  return { socket: socketRef.current, connected };
}
