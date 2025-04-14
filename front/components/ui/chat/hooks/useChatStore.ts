import { create } from "zustand";

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  timestamp: string;
  status?: "sending" | "delivered" | "failed";
  chatroomId: string; // Added to associate messages with chatrooms
}

interface UserData {
  id: string;
  name: string;
  avatar?: string;
}

interface Chatroom {
  id: string;
  title: string;
  participants?: UserData[];
}

interface ChatState {
  messages: Message[];
  chatrooms: Chatroom[];
  currentChatroomId: string | null;
  selectedUser: UserData | null;

  // Message actions
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessageStatus: (
    messageId: string,
    status: "delivered" | "failed"
  ) => void;

  // Chatroom actions
  setChatrooms: (chatrooms: Chatroom[]) => void;
  setCurrentChatroom: (chatroomId: string) => void;
  setSelectedUser: (user: UserData | null) => void;

  unreadCounts: Record<string, number>;
  incrementUnreadCount: (chatroomId: string) => void;
  resetUnreadCount: (chatroomId: string) => void;
  // Reset
  reset: () => void;
}

const initialState = {
  messages: [],
  chatrooms: [],
  currentChatroomId: null,
  selectedUser: null,
};

const useChatStore = create<ChatState>((set) => ({
  ...initialState,

  // Message actions
  setMessages: (messages) => set({ messages }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
      chatrooms: state.chatrooms.map((room) =>
        room.id === message.chatroomId
          ? {
              ...room,
              lastMessage: message,
            }
          : room
      ),
    })),

  updateMessageStatus: (messageId, status) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === messageId ? { ...msg, status } : msg
      ),
    })),

  // Chatroom actions
  setChatrooms: (chatrooms) => set({ chatrooms }),

  setCurrentChatroom: (chatroomId) => set({ currentChatroomId: chatroomId }),

  setSelectedUser: (user) => set({ selectedUser: user }),

  reset: () => set(initialState),
  unreadCounts: {},

  incrementUnreadCount: (chatroomId) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [chatroomId]: (state.unreadCounts[chatroomId] || 0) + 1,
      },
    })),

  resetUnreadCount: (chatroomId) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [chatroomId]: 0,
      },
    })),
}));

export default useChatStore;
