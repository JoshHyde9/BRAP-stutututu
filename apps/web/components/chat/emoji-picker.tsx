"use client";

import { EmojiPicker as Picker } from "@ferrucc-io/emoji-picker";

type EmojiPickerProps = {
  handleEmojiSelect: (emoji: string) => void;
};

export const EmojiPicker: React.FC<EmojiPickerProps> = ({
  handleEmojiSelect,
}) => {
  return (
    <Picker onEmojiSelect={handleEmojiSelect} emojiSize={30}>
      <Picker.Header className="p-2">
        <Picker.Input placeholder="Search emoji" autoFocus={true} />
      </Picker.Header>
      <Picker.Group>
        <Picker.List hideStickyHeader={true} containerHeight={400} />
      </Picker.Group>
      <Picker.Group>
        <Picker.Preview>
          {({ previewedEmoji }) => (
            <>
              {previewedEmoji ? <Picker.Content /> : <button>Add Emoji</button>}

              <Picker.SkinTone />
            </>
          )}
        </Picker.Preview>
      </Picker.Group>
    </Picker>
  );
};
