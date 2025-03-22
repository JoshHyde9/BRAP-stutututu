"use client";

import type z from "zod";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Check } from "lucide-react";

import { api } from "@workspace/api";

import { ignoreFriendRequestSchema } from "@/lib/schema";

import { ActionTooltip } from "@/components/action-tooltip";

type AcceptFriendRequestProps = {
  requestId: string;
};

export const AcceptFriendRequest: React.FC<AcceptFriendRequestProps> = ({
  requestId,
}) => {
  const router = useRouter();

  const onAcceptRequest = async (
    values: z.infer<typeof ignoreFriendRequestSchema>,
  ) => {
    const { data, error } = await api.friend.accept.patch(values);

    if (error) throw error;

    return data;
  };

  const { mutate: acceptRequest } = useMutation({
    mutationFn: onAcceptRequest,
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <ActionTooltip label="Accept">
      <div className="flex items-center rounded-full bg-zinc-200 p-2.5 dark:bg-zinc-800/40">
        <Check onClick={() => acceptRequest({requestId})} className="text-discord hover:text-discord/70" />
      </div>
    </ActionTooltip>
  );
};
