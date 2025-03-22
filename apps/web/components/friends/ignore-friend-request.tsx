"use client";

import type z from "zod";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { X } from "lucide-react";

import { api } from "@workspace/api";

import { ignoreFriendRequestSchema } from "@/lib/schema";

import { ActionTooltip } from "@/components/action-tooltip";

type IgnoreFriendRequest = {
  requestId: string;
};

export const IgnoreFriendRequest: React.FC<IgnoreFriendRequest> = ({
  requestId,
}) => {
  const router = useRouter();

  const onIgnoreRequest = async (
    values: z.infer<typeof ignoreFriendRequestSchema>,
  ) => {
    const { data, error } = await api.friend.ignore.delete(values);

    if (error) throw error;

    return data;
  };

  const { mutate: ignoreRequest } = useMutation({
    mutationFn: onIgnoreRequest,
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <ActionTooltip label="Ignore">
      <div className="flex items-center rounded-full bg-zinc-200 p-2.5 dark:bg-zinc-800/40">
        <X
          onClick={() => ignoreRequest({ requestId })}
          className="text-zinc-600 transition hover:text-rose-500 dark:text-zinc-300 dark:hover:text-rose-400"
        />
      </div>
    </ActionTooltip>
  );
};
