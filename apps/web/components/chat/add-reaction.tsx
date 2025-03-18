"use client";

import type { Emoji } from "@/components/chat/emoji-picker";

import { useState } from "react";
import { SmilePlus } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { cn } from "@workspace/ui/lib/utils";

import { useChatSocket } from "@/hooks/use-chat-socket";

import { ActionTooltip } from "@/components/action-tooltip";
import { EmojiPicker } from "@/components/chat/emoji-picker";

type AddReactionProps = {
  channelId: string;
  serverId: string;
  messageId: string;
  variant?: "button" | "icon";
};

export const AddReaction: React.FC<AddReactionProps> = ({
  channelId,
  serverId,
  messageId,
  variant = "icon",
}) => {
  const { messageReaction } = useChatSocket();
  const [open, setOpen] = useState(false);

  const handleEmojiSelect = (emoji: Emoji) => {
    messageReaction.mutate({
      channelId,
      serverId,
      messageId,
      value: emoji.native,
    });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <ActionTooltip label="Add Reaction">
          <div
            className={cn(
              variant === "button" &&
                "rounded-md border border-[#f2f3f5] bg-[#f2f3f5] px-4 py-0.5 text-zinc-600 transition hover:border-zinc-300 dark:border-[#2b2d31] dark:bg-[#2b2d31] dark:text-zinc-300 dark:hover:border-[#1e1f22]",
            )}
          >
            <SmilePlus
              onClick={() => setOpen(true)}
              className={cn(
                "ml-auto cursor-pointer text-zinc-500 transition hover:text-zinc-600 dark:hover:text-zinc-300",
                variant === "button" ? "size-5" : "size-4",
              )}
            />
          </div>
        </ActionTooltip>
      </PopoverTrigger>
      <PopoverContent side="left" className="w-fit">
        <EmojiPicker handleEmojiSelect={handleEmojiSelect} />
      </PopoverContent>
    </Popover>
  );
};
