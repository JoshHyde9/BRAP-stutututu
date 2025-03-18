"use client";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import { useTheme } from "next-themes";

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
};

export const EmojiPicker: React.FC<EmojiPickerProps> = ({
  handleEmojiSelect,
}) => {
  const { resolvedTheme } = useTheme();
  return (
    <Picker
      theme={resolvedTheme}
      data={data}
      onEmojiSelect={handleEmojiSelect}
    />
  );
};
