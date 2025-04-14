"use client";

import { FileImage, Paperclip, SendHorizontal, XCircle } from "lucide-react";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { EmojiPickerComponent } from "./emoji-picker";

interface ChatBottombarProps {
  isMobile: boolean;
  isSending: boolean;
  sendMessage: (content: string) => void;
}

export default function ChatBottombar({
  isMobile,
  isSending,
  sendMessage,
}: ChatBottombarProps) {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(message.trim());
      setMessage("");
      setFile(null);
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    isImage: boolean
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];

      if (isImage && !selectedFile.type.startsWith("image/")) {
        alert("Only image files are allowed!");
        return;
      }

      if (selectedFile.size > MAX_FILE_SIZE) {
        alert("File size exceeds the 5MB limit!");
        return;
      }

      setFile(selectedFile);
      event.target.value = "";
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  return (
    <div className="px-2 py-4 flex justify-between w-full items-center gap-2">
      <AnimatePresence initial={false}>
        <motion.div
          key="input"
          className="w-full relative"
          layout
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{
            opacity: { duration: 0.05 },
            layout: {
              type: "spring",
              bounce: 0.15,
            },
          }}
        >
          {file ? (
            <div className="flex items-center gap-2 p-2 bg-muted text-white rounded-lg">
              <span>{file.name}</span>
              <Button variant="ghost" size="icon" onClick={handleRemoveFile}>
                <XCircle size={18} className="text-muted-foreground" />
              </Button>
            </div>
          ) : (
            <ChatInput
              value={message}
              ref={inputRef}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type a message..."
              className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary resize-none overflow-hidden"
              disabled={isSending}
            />
          )}
        </motion.div>
        <div className="flex items-center gap-2">
          <EmojiPickerComponent
            onChange={(value) => {
              setMessage(message + value);
              if (inputRef.current) {
                inputRef.current.focus();
              }
            }}
            disabled={isSending}
          />
          <Button
            className="h-9 w-9 shrink-0"
            title="send message"
            onClick={handleSend}
            variant="ghost"
            size="icon"
            disabled={!message.trim() || isSending}
          >
            <SendHorizontal size={22} className="text-muted-foreground" />
          </Button>
        </div>
      </AnimatePresence>
    </div>
  );
}
