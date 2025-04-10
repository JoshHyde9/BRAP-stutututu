"use client";

import { useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useTheme } from "next-themes";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@workspace/ui/components/drawer";
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
import { useMediaQuery } from "@workspace/ui/hooks/use-media-query";

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

  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
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
  }

  return (
    <Drawer open={open} onOpenChange={handleOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="flex items-center">
        <DrawerHeader className="sr-only">
          <DrawerTitle>Emoji Picker</DrawerTitle>
          <DrawerDescription>Emoji Picker</DrawerDescription>
        </DrawerHeader>
        <Picker
          theme={resolvedTheme}
          data={data}
          onEmojiSelect={handleEmojiSelect}
        />
        <DrawerFooter />
      </DrawerContent>
    </Drawer>
  );
};
