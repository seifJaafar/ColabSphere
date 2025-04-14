"use client";

import { Message as MessageType, UserData } from "@/types/chat";
import ChatTopbar from "./chat-topbar";
import { ChatList } from "./chat-list";
import ChatBottombar from "./chat-bottombar";
import useChatStore from "@/components/ui/chat/hooks/useChatStore";
import { useUserStore } from "@/config/UserStore";
import React, { useState, useEffect } from "react";

interface ChatProps {
  messages?: MessageType[];
  selectedUser: UserData;
  isMobile: boolean;
  chatroomId: string;
  onSendMessage: (message: {
    chatroom_id: string;
    sender_id: string;
    sender_name: string;
    sender_avatar?: string;
    content: string;
  }) => Promise<void>;
}

export function Chat({
  messages = [],
  selectedUser,
  isMobile,
  chatroomId,
  onSendMessage,
}: ChatProps) {
  const {
    messages: storeMessages,
    addMessage,
    updateMessageStatus,
  } = useChatStore();
  const { user } = useUserStore();
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (messages.length > 0) {
      useChatStore.getState().setMessages(
        messages.map((msg) => ({
          ...msg,
          timestamp:
            msg.timestamp instanceof Date
              ? msg.timestamp.toISOString()
              : msg.timestamp,
        }))
      );
    }
  }, [messages]);

  const handleSend = async (content: string) => {
    if (!content.trim() || isSending || !user) return;

    const tempId = `temp-${Date.now()}`;
    const newMessage = {
      id: tempId,
      content: content.trim(),
      senderId: user.id,
      senderName: user.username,
      senderAvatar: user.avatar,
      timestamp: new Date().toISOString(),
      status: "sending" as const,
    };
    console.log("Sending message:", newMessage);
    addMessage(newMessage);
    setIsSending(true);

    try {
      await onSendMessage({
        chatroom_id: chatroomId,
        sender_id: user.id,
        sender_name: user.name,
        sender_avatar: user.avatar,
        content: content.trim(),
      });
      updateMessageStatus(tempId, "delivered");
    } catch (error) {
      updateMessageStatus(tempId, "failed");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col justify-between w-full h-full">
      <ChatTopbar selectedUser={selectedUser} />
      <ChatList
        messages={storeMessages}
        selectedUser={selectedUser}
        userID={user?.id}
        isMobile={isMobile}
      />
      <ChatBottombar
        sendMessage={handleSend}
        isMobile={isMobile}
        isSending={isSending}
      />
    </div>
  );
}
