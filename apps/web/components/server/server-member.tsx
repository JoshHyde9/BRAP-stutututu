"use client";

import type { MemberWithUser, UserInfo } from "@/lib/types";

import { useParams, useRouter } from "next/navigation";

import { cn } from "@workspace/ui/lib/utils";

import { roleIconMap } from "@/lib/iconMaps";

import { UserAvatar } from "@/components/user-avatar";

type ServerMemberProps = {
  member: MemberWithUser;
  user?: never;
};

type ConversationProps = {
  member?: MemberWithUser;
  user: UserInfo;
};

type MemberProps = ServerMemberProps | ConversationProps;

type ParamsProps = {
  memberId: string;
  serverId: string;
};

export const ServerMember: React.FC<MemberProps> = ({ member, user }) => {
  const params = useParams<ParamsProps>();
  const router = useRouter();

  const onClick = (userId?: string) => {
    router.push(`/conversation/${userId}`);
  };

  return (
    <button
      onClick={() => onClick(member ? member.userId : user ? user.id : "")}
      className={cn(
        "group mb-1 flex w-full items-center gap-x-2 rounded-md p-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50",
        member &&
          params.memberId === member.id &&
          "bg-zinc-700/20 dark:bg-zinc-700",
      )}
    >
      <UserAvatar
        src={member ? member.user.image : user?.image}
        name={
          member
            ? (member.nickname ?? member.user.displayName ?? member.user.name)
            : (user!.displayName ?? user!.name)
        }
        className="size-8 md:size-8"
      />
      <div className="flex w-full pl-2 text-left">
        <p
          className={cn(
            "w-32 truncate text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300",
            member &&
              params.memberId === member.id &&
              "text-primary dark:text-zinc-200 dark:group-hover:text-white",
          )}
        >
          {member
            ? (member.nickname ?? member.user.displayName ?? member.user.name)
            : (user?.displayName ?? user?.name)}
        </p>
        {member && <span className="ml-auto">{roleIconMap[member.role]}</span>}
      </div>
    </button>
  );
};
