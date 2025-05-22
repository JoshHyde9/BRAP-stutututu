"use client";

import type z from "zod";
import type { ignoreFriendRequestSchema } from "@/lib/schema";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { X } from "lucide-react";

import { api } from "@workspace/api";


import { ActionTooltip } from "@/components/action-tooltip";

type CancelFriendRequestProps = {
  requestId: string;
};

export const CancelFriendRequest: React.FC<CancelFriendRequestProps> = ({
  requestId,
}) => {
  const router = useRouter();

  const onCancelRequest = async (
    values: z.infer<typeof ignoreFriendRequestSchema>,
  ) => {
    const { data, error } = await api.friend.cancel.delete(values);

    if (error) throw error;

    return data;
  };

  const { mutate: cancelRequest } = useMutation({
    mutationFn: onCancelRequest,
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <ActionTooltip label="Cancel">
      <div className="flex items-center rounded-full bg-zinc-200 p-2.5 dark:bg-zinc-800/40">
        <X
          onClick={() => cancelRequest({ requestId })}
          className="text-zinc-600 transition hover:text-rose-500 dark:text-zinc-300 dark:hover:text-rose-400"
        />
      </div>
    </ActionTooltip>
  );
};
