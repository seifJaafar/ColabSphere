"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@heroui/avatar";
import { Message } from "@/data/ChatData";
import { Badge } from "@/components/ui/badge";
interface SidebarProps {
  isCollapsed: boolean;
  chats: {
    id: string; // Add id to the chat object
    name: string;
    messages: Message[];
    avatar: string;
    variant: "secondary" | "ghost";
    unreadCount?: number;
  }[];
  isMobile: boolean;
  onSelectChat?: (id: string) => void; // Make it optional
}

export function Sidebar({ chats, isCollapsed, onSelectChat }: SidebarProps) {
  const handleChatClick = (id: string) => {
    if (onSelectChat) {
      onSelectChat(id);
    }
  };

  return (
    <div className="relative flex flex-col h-full bg-muted/10 dark:bg-muted/20 gap-4 p-3">
      {!isCollapsed && (
        <div>
          <div className="flex gap-2 items-center text-2xl mb-4">
            <p className="font-medium">Chats</p>
            <span className="text-zinc-300">({chats.length})</span>
          </div>
          <Separator />
        </div>
      )}
      <nav className="flex flex-col items-center gap-2">
        {chats.map((chat) => (
          <Link
            key={chat.id}
            href="#"
            className="flex items-center gap-2 p-2 w-full hover:bg-muted"
            onClick={(e) => {
              e.preventDefault();
              handleChatClick(chat.id);
            }}
          >
            <Avatar
              name={chat.name}
              alt={chat.name}
              size="md"
              {...(isCollapsed && { className: "w-8 h-8" })}
            />
            {!isCollapsed && (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">{chat.name}</span>
                {chat.unreadCount > 0 && (
                  <Badge variant="destructive">{chat.unreadCount}</Badge>
                )}
              </div>
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
}
