// providers/SocketProvider.tsx
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { getSocket } from "@/config/socket";
import { getAuthToken } from "@/config/auth";

interface SocketContextType {
  socket: any;
  joinChatrooms: (chatroomIds: string[]) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const initializeSocket = async () => {
      const token = await getAuthToken();
      if (!token) return;

      const socketInstance = getSocket(token);
      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    };

    initializeSocket();
  }, []);

  const joinChatrooms = (chatroomIds: string[]) => {
    if (socket?.connected) {
      socket.emit("joinChatrooms", chatroomIds);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, joinChatrooms }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
