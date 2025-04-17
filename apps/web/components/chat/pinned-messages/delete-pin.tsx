"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import * as z from "zod";

import { api } from "@workspace/api";

import { createPinnedMessage } from "@/lib/schema";

import { ActionTooltip } from "@/components/action-tooltip";

type DeletPinProps = {
  messageId: string;
  channelId: string;
};

export const DeletePin: React.FC<DeletPinProps> = ({
  messageId,
  channelId,
}) => {
  const queryClient = useQueryClient();

  const handleDeletPin = async (
    values: z.infer<typeof createPinnedMessage>,
  ) => {
    const parsedValues = await createPinnedMessage.parseAsync(values);
    const { data, error } = await api.message.pinMessage.delete(parsedValues);

    if (error) throw error;

    return data;
  };

  const { mutate: deletePin } = useMutation({
    mutationFn: handleDeletPin,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["pinnedMessages", channelId],
      });
    },
  });

  return (
    <button onClick={() => deletePin({ channelId, messageId })}>
      <ActionTooltip label="Delete Pin">
        <X className="text-zinc-500 transition hover:text-zinc-600 dark:hover:text-zinc-300" />
      </ActionTooltip>
    </button>
  );
};
