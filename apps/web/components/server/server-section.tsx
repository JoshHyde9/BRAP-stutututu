"use client";

import type { SectionType, ServerWithMembers } from "@/lib/types";

import { Plus, Settings } from "lucide-react";

import { type ChannelType, MemberRole } from "@workspace/db";

import { useModal } from "@/hooks/use-modal-store";

import { ActionTooltip } from "@/components/action-tooltip";

type ServerSectionProps = {
  label: string;
  role?: MemberRole;
  sectionType: SectionType;
  channelType?: ChannelType;
  server: ServerWithMembers;
};

export const ServerSection: React.FC<ServerSectionProps> = ({
  label,
  sectionType,
  channelType,
  role,
  server,
}) => {
  const { onOpen } = useModal();

  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {role !== MemberRole.GUEST && sectionType === "channel" && (
        <ActionTooltip label="Create Channel" side="top">
          <button
            className="text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
            onClick={() => onOpen("createChannel", { server, channelType })}
          >
            <Plus className="size-4" />
          </button>
        </ActionTooltip>
      )}

      {role === MemberRole.ADMIN && sectionType === "member" && (
        <ActionTooltip label="Manage Members" side="top">
          <button
            className="text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
            onClick={() => onOpen("members", { server })}
          >
            <Settings className="size-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};
