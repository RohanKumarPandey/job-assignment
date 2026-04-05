import { create } from 'zustand';

export const useChatStore = create((set) => ({
  messages: [],
  unreadCount: 0,

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
      unreadCount: state.unreadCount + 1,
    })),
  markAllRead: () => set({ unreadCount: 0 }),
  addReaction: (messageId, reaction) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg._id === messageId
          ? { ...msg, reactions: [...(msg.reactions ?? []), reaction] }
          : msg
      ),
    })),
  clearMessages: () => set({ messages: [], unreadCount: 0 }),
}));
