"use client";

import type { QueryParamsKeys } from "@/lib/types";
import type z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Plus, Smile } from "lucide-react";
import { useForm } from "react-hook-form";

import { api } from "@workspace/api";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";

import { sendMessageSchema } from "@/lib/schema";

type ChatInputProps = {
  queryParams: Record<QueryParamsKeys, any>;
  name: string;
  type: "conversation" | "channel";
};

export const ChatInput: React.FC<ChatInputProps> = ({ queryParams, type, name }) => {
  const form = useForm({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      content: "",
      fileUrl: "",
    },
  });

  const onSendMessage = async (values: z.infer<typeof sendMessageSchema>) => {
    const { data, error } = await api.message
      .createMessage({
        serverId: queryParams.serverId,
      })({ channelId: queryParams.channelId })
      .post(values);

    if (error) throw error;

    return data;
  };

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: onSendMessage,
  });

  const onSubmit = async (values: z.infer<typeof sendMessageSchema>) => {
    const parsedData = await sendMessageSchema.parseAsync(values);
    sendMessage(parsedData);
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
                <div className="relative p-4 pb-6">
                  <button
                    type="button"
                    onClick={() => {}}
                    className="absolute left-8 top-7 flex size-[24px] items-center justify-center rounded-full bg-zinc-500 p-1 transition hover:bg-zinc-600 dark:bg-zinc-400 dark:hover:bg-zinc-300"
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>
                  <Input
                    disabled={isPending}
                    className="border-none bg-zinc-200/90 px-14 py-6 text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700/75 dark:text-zinc-200"
                    placeholder={`Message ${type === "conversation" ? name : `#${name}`}`}
                    {...field}
                  />
                  <div className="absolute right-8 top-8">
                    <Smile />
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
