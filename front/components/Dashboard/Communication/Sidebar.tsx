"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";

import { Avatar } from "@heroui/avatar";
import { Message } from "@/data/ChatData";

interface SidebarProps {
  isCollapsed: boolean;
  chats: {
    name: string;
    messages: Message[];
    avatar: string;
    variant: "secondary" | "ghost";
  }[];
  isMobile: boolean;
}

export function Sidebar({ chats, isCollapsed }: SidebarProps) {
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
        {chats.map((chat, index) => (
          <Link
            key={index}
            href="#"
            className="flex items-center gap-2 p-2 w-full hover:bg-muted"
          >
            <Avatar
              src={chat.avatar}
              alt={chat.name}
              size="md"
              {...(isCollapsed && { className: "w-8 h-8" })}
            />
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-medium">{chat.name}</span>
                {chat.messages.length > 0 && (
                  <span className="text-xs text-gray-500 truncate w-32">
                    {chat.messages[chat.messages.length - 1].name.split(" ")[0]}
                    :
                    {chat.messages[chat.messages.length - 1].isLoading
                      ? " Typing..."
                      : ` ${chat.messages[chat.messages.length - 1].message}`}
                  </span>
                )}
              </div>
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
}
