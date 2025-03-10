"use client";

import type { ModalType } from "@/hooks/use-modal-store";

import { useParams, useRouter } from "next/navigation";
import { Edit, Lock, Trash } from "lucide-react";

import { Channel, MemberRole, Server } from "@workspace/db";
import { cn } from "@workspace/ui/lib/utils";

import { useModal } from "@/hooks/use-modal-store";
import { sidebarIconMap } from "@/lib/iconMaps";

import { ActionTooltip } from "@/components/action-tooltip";

type ServerChannelProps = {
  channel: Channel;
  server: Server;
  loggedInUserRole: MemberRole;
};

type ParamsProps = {
  channelId: string;
  serverId: string;
};

export const ServerChannel: React.FC<ServerChannelProps> = ({
  channel,
  loggedInUserRole,
}) => {
  const params = useParams<ParamsProps>();
  const router = useRouter();

  const Icon = sidebarIconMap[channel.type];

  const onChannelClick = () => {
    router.push(`/server/${params.serverId}/channel/${channel.id}`);
  };

  return (
    <button
      onClick={onChannelClick}
      className={cn(
        "group mb-1 flex w-full items-center gap-x-2 rounded-md p-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50",
        params.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700",
      )}
    >
      <Icon className="size-5 shrink-0 text-zinc-500 dark:text-zinc-400" />
      <p
        className={cn(
          "line-clamp-1 text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300",
          params?.channelId === channel.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white",
        )}
      >
        {channel.name}
      </p>
      {channel.name !== "general" && loggedInUserRole !== MemberRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Edit">
            <Edit className="hidden size-4 text-zinc-500 transition hover:text-zinc-600 group-hover:block dark:text-zinc-400 dark:hover:text-zinc-300" />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <Trash className="hidden size-4 text-zinc-500 transition hover:text-zinc-600 group-hover:block dark:text-zinc-400 dark:hover:text-zinc-300" />
          </ActionTooltip>
        </div>
      )}
      {channel.name === "general" && (
        <Lock className="ml-auto hidden h-4 w-4 text-zinc-500 group-hover:block dark:text-zinc-400" />
      )}
    </button>
  );
};
