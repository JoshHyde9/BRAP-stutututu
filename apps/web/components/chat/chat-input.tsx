"use client";

import type { QueryParamsKeys } from "@/lib/types";
import type z from "zod";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";

import { useChatSocket } from "@/hooks/use-chat-socket";
import { useModal } from "@/hooks/use-modal-store";
import { sendMessageSchema } from "@/lib/schema";

import { ActionTooltip } from "@/components/action-tooltip";
import { EmojiPicker } from "@/components/chat/emoji-picker";

type ChatInputProps = {
  queryParams: Record<QueryParamsKeys, string>;
  name: string;
  type: "conversation" | "channel";
};

export const ChatInput: React.FC<ChatInputProps> = ({
  queryParams,
  type,
  name,
}) => {
  const { mutate: sendMessage, isPending } = useChatSocket();
  const { onOpen } = useModal();
  const form = useForm({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      content: "",
      fileUrl: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof sendMessageSchema>) => {
    const parsedData = await sendMessageSchema.parseAsync(values);
    sendMessage(
      {
        channelId: queryParams.channelId,
        serverId: queryParams.serverId,
        ...parsedData,
      },
      {
        onSuccess: () => {
          form.reset();
        },
      },
    );
  };

  const handleEmojiSelect = (emoji: string) => {
    form.setValue("content", `${form.getValues("content")} ${emoji}`);
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
                    disabled={isPending}
                    className="border-none bg-zinc-200/90 px-14 py-6 text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700/75 dark:text-zinc-200"
                    placeholder={`Message ${type === "conversation" ? name : `#${name}`}`}
                    {...field}
                  />
                  <div className="absolute right-8 flex items-center">
                    <Popover>
                      <PopoverTrigger>
                        <ActionTooltip label="Add emoji">
                          <Smile />
                        </ActionTooltip>
                      </PopoverTrigger>
                      <PopoverContent side="left" className="w-fit">
                        <EmojiPicker handleEmojiSelect={handleEmojiSelect} />
                      </PopoverContent>
                    </Popover>
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
