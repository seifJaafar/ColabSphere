"use client";

import { useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/Dashboard/Communication/Sidebar";
import { Chat } from "@/components/ui/chat/Chat";
import {
  getChatRooms,
  getChatRoomMessages,
} from "@/actions/communication/chatroom";
import useChatStore from "@/components/ui/chat/hooks/useChatStore";
import { useUserStore } from "@/config/UserStore";
import { useSocket } from "@/providers/socketProvider";

interface ChatLayoutProps {
  defaultLayout?: number[];
  defaultCollapsed?: boolean;
  navCollapsedSize?: number;
}

interface Chatroom {
  id: string;
  title: string;
  messages?: Message[];
  participants?: {
    id: string;
    name: string;
    avatar?: string;
  }[];
}

export function ChatLayout({
  defaultLayout = [250, 480],
  defaultCollapsed = false,
  navCollapsedSize = 8,
}: ChatLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [chatrooms, setChatrooms] = useState<Chatroom[] | null>(null);
  const [selectedChatroom, setSelectedChatroom] = useState<Chatroom | null>(
    null
  );
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {
    setMessages,
    setSelectedUser,
    reset,
    addMessage,
    updateMessageStatus,
    unreadCounts,
    incrementUnreadCount,
    resetUnreadCount,
  } = useChatStore();
  const { joinChatrooms, socket } = useSocket();
  const { user } = useUserStore();

  // Initialize socket listeners for real-time messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: Message) => {
      if (
        message.senderId !== user?.id &&
        message.chatroomId !== selectedChatroom?.id
      ) {
        incrementUnreadCount(message.chatroomId);
      }
      if (message.chatroomId === selectedChatroom?.id) {
        console.log("New message in selected chatroom:", message);
        console.log("my id ", message.senderId === user?.id);
        if (message.senderId === user?.id) {
          updateMessageStatus(`temp-${message.id}`, "delivered");
        } else {
          console.log("New message received:", message);
          addMessage({
            id: message.id,
            content: message.content,
            senderId: message.senderId,
            senderName: message.senderName,
            senderAvatar: message.senderAvatar,
            timestamp: new Date(message.timestamp).toISOString(),
          });
        }
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [
    socket,
    selectedChatroom,
    user,
    addMessage,
    updateMessageStatus,
    incrementUnreadCount,
  ]);

  // Screen size detection
  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);

    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  // Fetch chatrooms on mount
  useEffect(() => {
    const fetchChatrooms = async () => {
      try {
        setLoading(true);
        const response = await getChatRooms();

        if (response?.success) {
          const chats = response.chats || [];
          setChatrooms(
            chats.map((chat) => ({
              ...chat,
              messages: chat.messages?.map((msg) => ({
                ...msg,
                timestamp:
                  msg.timestamp instanceof Date
                    ? msg.timestamp.toISOString()
                    : msg.timestamp,
              })),
            }))
          );

          if (chats.length > 0) {
            joinChatrooms(chats.map((c) => c.id));
            handleSelectChatroom(chats[0]);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchChatrooms();

    return () => {
      reset();
    };
  }, [joinChatrooms, reset]);

  const handleSelectChatroom = async (chatroom: Chatroom) => {
    if (!chatroom) return;

    try {
      setLoading(true);
      setSelectedChatroom(chatroom);

      // First set the existing messages (if any)
      const initialMessages = (chatroom.messages || []).map((msg) => ({
        ...msg,
        timestamp:
          msg.timestamp instanceof Date
            ? msg.timestamp.toISOString()
            : msg.timestamp,
      }));
      setMessages(initialMessages);

      // Then fetch fresh messages from the server
      const response = await getChatRoomMessages(chatroom.id);
      console.log("Chatroom messages response:", response);

      if (response?.success) {
        const freshMessages = (response.messages || []).map((msg) => ({
          ...msg,
          timestamp:
            msg.timestamp instanceof Date
              ? msg.timestamp.toISOString()
              : msg.timestamp,
        }));

        // Update both the chatrooms state and messages in the store
        setChatrooms(
          (prev) =>
            prev?.map((room) =>
              room.id === chatroom.id
                ? { ...room, messages: freshMessages }
                : room
            ) || null
        );

        setMessages(freshMessages);
        resetUnreadCount(chatroom.id);
      } else {
        console.error("Failed to fetch messages:", response?.message);
      }

      setSelectedUser({
        id: chatroom.id,
        name: chatroom.title,
        avatar: chatroom.participants?.[0]?.avatar || "/default-avatar.png",
      });
    } catch (err) {
      console.error("Error selecting chatroom:", err);
      setError(err instanceof Error ? err.message : "Failed to load chatroom");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (message: {
    chatroom_id: string;
    sender_id: string;
    sender_name: string;
    sender_avatar?: string;
    content: string;
  }) => {
    if (!selectedChatroom || !user?.id || !socket) return;

    // Create optimistic message
    const tempId = `temp-${Date.now()}`;

    try {
      socket.emit("sendMessage", {
        chatroomId: selectedChatroom.id,
        content: message.content,
        senderId: user.id,
        senderName: user.name,
        senderAvatar: user.avatar,
        tempId, // Pass tempId to match with server response
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      updateMessageStatus(tempId, "failed");
      console.error("Failed to send message:", error);
    }
  };

  if (loading) {
    return <div className="p-4">Loading chatrooms...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!chatrooms || chatrooms.length === 0) {
    return <div className="p-4">No chatrooms found</div>;
  }

  return (
    <div className="max-h-[80vh] max-w-[100%] flex flex-1 rounded-xl bg-muted/50 p-6">
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`;
        }}
        className="h-full w-full items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible
          minSize={isMobile ? 0 : 24}
          maxSize={isMobile ? 8 : 30}
          onCollapse={() => setIsCollapsed(true)}
          onExpand={() => setIsCollapsed(false)}
          className={cn(
            isCollapsed &&
              "min-w-[50px] md:min-w-[70px] transition-all duration-300 ease-in-out"
          )}
        >
          <Sidebar
            isCollapsed={isCollapsed || isMobile}
            chats={chatrooms.map((chatroom) => ({
              id: chatroom.id,
              name: chatroom.title,
              messages: chatroom.messages || [],
              avatar:
                chatroom.participants?.[0]?.avatar ?? "/default-avatar.png",
              variant:
                selectedChatroom?.id === chatroom.id ? "secondary" : "ghost",
              unreadCount: unreadCounts[chatroom.id] || 0,
            }))}
            isMobile={isMobile}
            onSelectChat={(id) => {
              console.log(id);
              const chatroom = chatrooms.find((c) => c.id === id);
              if (chatroom) handleSelectChatroom(chatroom);
            }}
            // Pass the unread count for each chatroom
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          {selectedChatroom && (
            <Chat
              messages={selectedChatroom.messages || []}
              selectedUser={{
                id: selectedChatroom.id,
                name: selectedChatroom.title,
                avatar:
                  selectedChatroom.participants?.[0]?.avatar ??
                  "/default-avatar.png",
              }}
              isMobile={isMobile}
              chatroomId={selectedChatroom.id}
              onSendMessage={handleSendMessage}
            />
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
