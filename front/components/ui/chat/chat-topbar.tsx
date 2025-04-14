"use client";
import React, { useState } from "react";
import { Avatar } from "@heroui/avatar";
import { UserData } from "@/data/ChatData";
import { Info, Pin, Link as LinkIcon, Copy, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "../textarea";
interface ChatTopbarProps {
  selectedUser: UserData;
}

export const TopbarIcons = [
  { icon: Pin, title: "pinned message" },
  { icon: LinkIcon, title: "important link" },
  { icon: Info, title: "details" },
];

export default function ChatTopbar({ selectedUser }: ChatTopbarProps) {
  const [pinnedMessage, setPinnedMessage] = useState<string>("");
  const [importantLink, setImportantLink] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(pinnedMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };
  return (
    <div className="flex items-center justify-between p-4 border-b border-muted-foreground">
      <div className="flex items-center gap-2">
        <Avatar
          className="w-10 h-10"
          name={selectedUser.name}
          alt={selectedUser.name}
        ></Avatar>
        <span className="font-medium">{selectedUser.name}</span>
      </div>

      <div className="flex gap-1">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant={"ghost"} size={"icon"} title={"Pinned message"}>
              <Pin size={20} className="text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Pinned Message</h4>
                <p className="text-sm text-muted-foreground">
                  Add Pinend Message to the chat
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Textarea
                  id="pinnedMessage"
                  className="col-span-2 h-8"
                  placeholder="Type your message"
                  value={pinnedMessage}
                  onChange={(e) => setPinnedMessage(e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  title="Copy to clipboard"
                  onClick={copyToClipboard}
                >
                  {copied ? <Check className="text-green-600" /> : <Copy />}
                </Button>
                <Button variant={"default"} size={"sm"} title="add">
                  Add
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant={"ghost"} size={"icon"} title={"Important link"}>
              <LinkIcon size={20} className="text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Important Link</h4>
                <p className="text-sm text-muted-foreground">
                  Add important link to the chat
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  id="importantLink"
                  defaultValue="100%"
                  className="col-span-2 h-8"
                  placeholder="Type your message"
                  value={importantLink}
                  onChange={(e) => setImportantLink(e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  title="Copy to clipboard"
                  onClick={copyToClipboard}
                >
                  {copied ? <Check className="text-green-600" /> : <Copy />}
                </Button>
                <Button variant={"default"} size={"sm"} title="add">
                  Add
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Button variant={"ghost"} size={"icon"} title={"Details"}>
          <Info size={20} className="text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}
