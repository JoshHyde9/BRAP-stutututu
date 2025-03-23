"use client";

import type { QueryParamsKeys } from "@/lib/types";
import type z from "zod";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Smile } from "lucide-react";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";

import { useConversations } from "@/hooks/use-conversations";
import { useModal } from "@/hooks/use-modal-store";
import { sendMessageSchema } from "@/lib/schema";

import { ActionTooltip } from "@/components/action-tooltip";
import { Emoji, EmojiPicker } from "@/components/chat/emoji-picker";

type ChatInputProps = {
  queryParams: QueryParamsKeys;
  name: string;
  type: "conversation" | "channel";
  targetId: string;
};

export const ConversationChatInput: React.FC<ChatInputProps> = ({
  queryParams,
  type,
  name,
  targetId,
}) => {
  const { sendMessage } = useConversations({ targetId });
  const { onOpen } = useModal();
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      content: "",
      fileUrl: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof sendMessageSchema>) => {
    const parsedData = await sendMessageSchema.parseAsync(values);
    sendMessage.mutate(
      {
        ...parsedData,
        targetId,
        conversationId: queryParams.conversationId!
      },
      {
        onSuccess: () => {
          form.reset();
        },
      },
    );
  };

  const handleEmojiSelect = (emoji: Emoji) => {
    // TODO: Put emoji where cursor is
    // useRef?????
    form.setValue("content", `${form.getValues("content")} ${emoji.native}`);
    setOpen(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative flex items-center p-4 pb-6">
                  <ActionTooltip label="Upload file">
                    <button
                      type="button"
                      onClick={() =>
                        onOpen("messageFile", {
                          query: queryParams,
                        })
                      }
                      className="absolute left-8 top-7 flex size-[24px] items-center justify-center rounded-full bg-zinc-500 p-1 transition hover:bg-zinc-600 dark:bg-zinc-400 dark:hover:bg-zinc-300"
                    >
                      <Plus className="text-white dark:text-[#313338]" />
                    </button>
                  </ActionTooltip>
                  <Input
                    disabled={sendMessage.isPending}
                    autoComplete="off"
                    className="border-none bg-zinc-200/90 px-14 py-6 text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700/75 dark:text-zinc-200"
                    placeholder={`Message ${type === "conversation" ? name : `#${name}`}`}
                    {...field}
                  />
                  <div className="absolute right-8 flex items-center">
                    <EmojiPicker
                      label="Add Emoji"
                      side="top"
                      handleEmojiSelect={handleEmojiSelect}
                      open={open}
                      handleOpen={setOpen}
                    >
                      <Smile
                        onClick={() => setOpen(!open)}
                        className="ml-auto size-[24px] cursor-pointer text-zinc-500 transition hover:text-zinc-600 dark:hover:text-zinc-300"
                      />
                    </EmojiPicker>
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
