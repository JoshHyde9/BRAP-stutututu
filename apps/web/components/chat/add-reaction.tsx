"use client";

import type { Emoji } from "@/components/chat/emoji-picker";
import type { QueryParamsKeys } from "@/lib/types";

import { useState } from "react";
import { SmilePlus } from "lucide-react";

import { cn } from "@workspace/ui/lib/utils";

import { useReactions } from "@/hooks/message/use-reaction";

import { EmojiPicker } from "@/components/chat/emoji-picker";

type DefaultProps = {
  queryParams: QueryParamsKeys;
  messageId: string;
};

type ButtonVariantProps = {
  variant: "button" | "icon";
  children?: never;
  setDrawer?: never;
};

type DrawerVariantProps = {
  variant?: "drawer";
  children?: React.ReactNode;
  setDrawer?: (drawer: boolean) => void;
};

type AddReactionProps = DefaultProps &
  (ButtonVariantProps | DrawerVariantProps);

export const AddReaction: React.FC<AddReactionProps> = ({
  queryParams,
  messageId,
  variant = "icon",
  children,
  setDrawer,
}) => {
  const messageReaction = useReactions();
  const [open, setOpen] = useState(false);

  const handleEmojiSelect = (emoji: Emoji) => {
    messageReaction.mutate({
      queryParams,
      messageId,
      value: emoji.native,
    });
    setOpen(false);

    if (setDrawer) {
      setDrawer(false);
    }
  };

  if (variant === "drawer") {
    return (
      <EmojiPicker
        label="Add Reaction"
        handleEmojiSelect={handleEmojiSelect}
        side="right"
        handleOpen={setOpen}
        open={open}
      >
        <button
          className="flex w-full items-center justify-start pl-3"
          onClick={() => setOpen(true)}
        >
          <SmilePlus className="size-4 cursor-pointer text-black transition dark:text-neutral-200" />
          {children}
        </button>
      </EmojiPicker>
    );
  }

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
