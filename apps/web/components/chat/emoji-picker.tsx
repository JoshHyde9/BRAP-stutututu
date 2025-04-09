"use client";

import { useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useTheme } from "next-themes";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";

export type Emoji = {
  id: string;
  name: string;
  native: string;
  unified: string;
  shortcodes: string;
  keywords: string[];
  aliases: string[];
};

type EmojiPickerProps = {
  handleEmojiSelect: (emoji: Emoji) => void;
  children: React.ReactNode;
  label: string;
  side?: "top" | "right" | "bottom" | "left";
  handleOpen: (open: boolean) => void;
  open: boolean;
};

// TODO: Mobile picker is put into a drawer instead of a popover
export const EmojiPicker: React.FC<EmojiPickerProps> = ({
  handleEmojiSelect,
  children,
  label,
  side,
  open,
  handleOpen,
}) => {
  const { resolvedTheme } = useTheme();
  const [tooltipOpen, setTooltipOpen] = useState(false);

  return (
    <TooltipProvider>
      <Popover open={open} onOpenChange={handleOpen}>
        <Tooltip
          delayDuration={50}
          open={tooltipOpen}
          onOpenChange={setTooltipOpen}
        >
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent>
            <p className="text-sm font-semibold capitalize">{label}</p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent side={side} className="w-fit">
          <Picker
            theme={resolvedTheme}
            data={data}
            onEmojiSelect={handleEmojiSelect}
          />
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
};
