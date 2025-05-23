"use client";

import type { ModalType } from "@/hooks/use-modal-store";
import type { ServerWithMembers } from "@/lib/types";
import { type Channel, type Server, MemberRole } from "@workspace/db";

import { useParams } from "next/navigation";
import { Edit, Lock, Trash } from "lucide-react";

import { cn } from "@workspace/ui/lib/utils";

import { useModal } from "@/hooks/use-modal-store";
import { sidebarIconMap } from "@/lib/iconMaps";

import { ActionTooltip } from "@/components/action-tooltip";

type ServerChannelProps = {
  channel: Channel;
  server: ServerWithMembers;
  loggedInUserRole: MemberRole;
};

type ParamsProps = {
  channelId: string;
  serverId: string;
};

export const ServerChannel: React.FC<ServerChannelProps> = ({
  channel,
  server,
  loggedInUserRole,
}) => {
  const params = useParams<ParamsProps>();
  const { onOpen } = useModal();

  const Icon = sidebarIconMap[channel.type];

  // Stops onChannelClick from being called when opening Edit/Delete modals
  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();
    onOpen(action, { channel, server });
  };

  return (
    <button
      className={cn(
        "group mb-1 flex w-full items-center gap-x-2 rounded-md p-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50",
        params.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700",
      )}
    >
      <Icon className="size-5 shrink-0 text-zinc-500 dark:text-zinc-400" />
      <p
        className={cn(
          "line-clamp-1 w-32 truncate text-left text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300",
          params?.channelId === channel.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white",
        )}
      >
        {channel.name}
      </p>
      {channel.name !== "general" && loggedInUserRole !== MemberRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Edit">
            <Edit
              onClick={(e) => onAction(e, "editChannel")}
              className="hidden size-4 text-zinc-500 transition hover:text-zinc-600 group-hover:block dark:text-zinc-400 dark:hover:text-zinc-300"
            />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <Trash
              onClick={(e) => onAction(e, "deleteChannel")}
              className="hidden size-4 text-rose-500 transition hover:text-rose-600 group-hover:block dark:text-rose-400 dark:hover:text-rose-300"
            />
          </ActionTooltip>
        </div>
      )}
      {channel.name === "general" && (
        <Lock className="ml-auto hidden h-4 w-4 text-zinc-500 group-hover:block dark:text-zinc-400" />
      )}
    </button>
  );
};
