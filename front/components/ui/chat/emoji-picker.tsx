"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SmileIcon } from "lucide-react";
import EmojiPicker, { Theme } from "emoji-picker-react";

interface EmojiPickerProps {
  onChange: (value: string) => void;
}

export const EmojiPickerComponent = ({ onChange }: EmojiPickerProps) => {
  return (
    <Popover>
      <PopoverTrigger>
        <SmileIcon className="h-5 w-5 text-muted-foreground hover:text-foreground transition" />
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <EmojiPicker
          theme={Theme.DARK}
          onEmojiClick={(e) => {
            onChange(e.emoji);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};
