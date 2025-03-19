"use client";

import type { Emoji } from "@/components/chat/emoji-picker";

import { useState } from "react";
import { SmilePlus } from "lucide-react";

import { cn } from "@workspace/ui/lib/utils";

import { useChatSocket } from "@/hooks/use-chat-socket";

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
    <EmojiPicker
      label="Add Reaction"
      handleEmojiSelect={handleEmojiSelect}
      side="right"
      handleOpen={setOpen}
      open={open}
    >
      <button
        className={cn(
          variant === "button" &&
            "rounded-md border border-[#f2f3f5] bg-[#f2f3f5] px-4 py-0.5 text-zinc-600 transition hover:border-zinc-300 dark:border-[#2b2d31] dark:bg-[#2b2d31] dark:text-zinc-300 dark:hover:border-[#1e1f22]",
        )}
      >
        <SmilePlus
          onClick={() => setOpen(!open)}
          className={cn(
            "ml-auto cursor-pointer text-zinc-500 transition hover:text-zinc-600 dark:hover:text-zinc-300",
            variant === "button" ? "size-5" : "size-4",
          )}
        />
      </button>
    </EmojiPicker>
  );
};
