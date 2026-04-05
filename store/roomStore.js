import { create } from 'zustand';

export const useRoomStore = create((set) => ({
  roomId: null,
  participants: [],
  messages: [],
  localStream: null,
  remoteStreams: [],
  isRecording: false,

  setRoomId: (roomId) => set({ roomId }),
  setLocalStream: (localStream) => set({ localStream }),
  setParticipants: (participants) => set({ participants }),
  addParticipant: (participant) =>
    set((state) => ({
      participants: state.participants.some((p) => p.userId === participant.userId)
        ? state.participants
        : [...state.participants, participant],
    })),
  removeParticipant: (userId) =>
    set((state) => ({
      participants: state.participants.filter((p) => p.userId !== userId),
    })),
  setRemoteStreams: (remoteStreams) => set({ remoteStreams }),
  addRemoteStream: (stream) =>
    set((state) => ({
      remoteStreams: [
        ...state.remoteStreams.filter((s) => s.socketId !== stream.socketId),
        stream,
      ],
    })),
  removeRemoteStream: (socketId) =>
    set((state) => ({
      remoteStreams: state.remoteStreams.filter((s) => s.socketId !== socketId),
    })),
  setRecording: (isRecording) => set({ isRecording }),
  reset: () =>
    set({
      roomId: null,
      participants: [],
      messages: [],
      localStream: null,
      remoteStreams: [],
      isRecording: false,
    }),
}));
