"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pin } from "lucide-react";
import * as z from "zod";

import { api } from "@workspace/api";

import { createPinnedMessage } from "@/lib/schema";

import { ActionTooltip } from "@/components/action-tooltip";

type PinMessageProps = {
  messageId: string;
  channelId: string;
};

export const PinMessage: React.FC<PinMessageProps> = ({
  channelId,
  messageId,
}) => {
  const queryClient = useQueryClient();
  const onPinMessage = async (values: z.infer<typeof createPinnedMessage>) => {
    const parsedParams = await createPinnedMessage.parseAsync(values);
    const { data, error } = await api.message.pinMessage.post(parsedParams);

    if (error) throw error;

    return data;
  };

  const { mutate } = useMutation({
    mutationFn: onPinMessage,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["pinnedMessages", channelId],
      });
    },
  });

  return (
    <button onClick={() => mutate({ channelId, messageId })}>
      <ActionTooltip label="Pin Message">
        <Pin className="size-4 rotate-45 cursor-pointer text-zinc-500 transition hover:text-zinc-600 dark:hover:text-zinc-300" />
      </ActionTooltip>
    </button>
  );
};
