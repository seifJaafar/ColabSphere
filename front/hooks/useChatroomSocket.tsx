// hooks/useChatroomSocket.ts
"use client";

import { useEffect } from "react";
import { useSocket } from "@/providers/socketProvider";

export const useChatroomSocket = (chatroomId: string | null) => {
  const { joinChatroom, leaveChatroom } = useSocket();

  useEffect(() => {
    if (!chatroomId) return;

    joinChatroom(chatroomId);

    return () => {
      leaveChatroom(chatroomId);
    };
  }, [chatroomId, joinChatroom, leaveChatroom]);
};
