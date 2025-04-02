import { Message, UserData } from "@/data/ChatData";
import ChatTopbar from "@/components/ui/chat/chat-topbar";
import { ChatList } from "@/components/ui/chat/chat-list";
import React, { useEffect, useState } from "react";
import useChatStore from "@/components/ui/chat/hooks/useChatStore";
import ChatBottombar from "@/components/ui/chat/chat-bottombar";

interface ChatProps {
  messages?: Message[];
  selectedUser: UserData;
  isMobile: boolean;
}

export function Chat({ messages, selectedUser, isMobile }: ChatProps) {
  const messagesState = useChatStore((state) => state.messages);

  const sendMessage = (newMessage: Message) => {
    useChatStore.setState((state) => ({
      messages: [...state.messages, newMessage],
    }));
  };

  return (
    <div className="flex flex-col justify-between w-full h-full">
      <ChatTopbar selectedUser={selectedUser} />

      <ChatList
        messages={messagesState}
        selectedUser={selectedUser}
        sendMessage={sendMessage}
        isMobile={isMobile}
      />

      <ChatBottombar isMobile={isMobile} />
    </div>
  );
}
