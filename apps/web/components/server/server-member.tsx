"use client";

import type { MemberWithUser } from "@/lib/types";
import type { Server } from "@workspace/db";

import { useParams, useRouter } from "next/navigation";

import { cn } from "@workspace/ui/lib/utils";

import { roleIconMap } from "@/lib/iconMaps";

import { UserAvatar } from "@/components/user-avatar";

type ServerMemberProps = {
  member: MemberWithUser;
  server: Server;
};

type ParamsProps = {
  memberId: string;
  serverId: string;
};

export const ServerMember: React.FC<ServerMemberProps> = ({
  server,
  member,
}) => {
  const params = useParams<ParamsProps>();
  const router = useRouter();

  const icon = roleIconMap[member.role];

  const onClick = () => {
    router.push(`/server/${params.serverId}/conversation/${member.id}`);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "group mb-1 flex w-full items-center gap-x-2 rounded-md p-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50",
        params.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700",
      )}
    >
      <UserAvatar
        src={member.user.image!}
        name={member.nickname ?? member.user.displayName ?? member.user.name}
        className="size-8 md:size-8"
      />
      <div className="flex w-full pl-2 text-left">
        <p
          className={cn(
            "w-32 truncate text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300",
            params.memberId === member.id &&
              "text-primary dark:text-zinc-200 dark:group-hover:text-white",
          )}
        >
          {member.nickname ?? member.user.displayName ?? member.user.name}
        </p>
        <span className="ml-auto">{icon}</span>
      </div>
    </button>
  );
};
