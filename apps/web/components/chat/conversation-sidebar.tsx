// TODO: Refactor to use Server Member component

"use client";

import type { Session } from "@workspace/auth";

import { useParams, useRouter } from "next/navigation";

import { Conversation } from "@workspace/db";
import { cn } from "@workspace/ui/lib/utils";

import { roleIconMap } from "@/lib/iconMaps";
import { UserInfo } from "@/lib/types";

import { ServerSearch } from "@/components/server/server-search";
import { UserAvatar } from "@/components/user-avatar";

type ConversationSidebarProps = {
  loggedInUser: Pick<Session, "user">;
  conversations: Conversation & { userOne: UserInfo; userTwo: UserInfo }[];
};

type ParamsProps = {
  userId: string;
};

export const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  conversations,
  loggedInUser,
}) => {
  const params = useParams<ParamsProps>();
  const router = useRouter();

  const onClick = (userId: string) => {
    router.push(`/conversation/${userId}`);
  };

  return (
    <div className="text-primary flex h-full w-full flex-col bg-[#f2f3f5] dark:bg-[#2b2d31]">
      <div className="flex h-12 items-center border-b-2 border-neutral-200 px-3 dark:border-neutral-800">
        <ServerSearch
          data={[
            {
              label: "Members",
              type: "member",
              data: conversations.map((conversation) => {
                const otherMember =
                  conversation.userOne.id === loggedInUser.user.id
                    ? conversation.userTwo
                    : conversation.userOne;
                return {
                  id: otherMember.id,
                  icon: roleIconMap["GUEST"],
                  name: otherMember.displayName ?? otherMember.name,
                };
              }),
            },
          ]}
        />
      </div>
      {conversations.map((conversation, i) => {
        const otherMember =
          conversation.userOne.id === loggedInUser.user.id
            ? conversation.userTwo
            : conversation.userOne;
        return (
          <button
            key={i}
            onClick={() => onClick(otherMember.id)}
            className={cn(
              "group mb-1 flex w-full items-center gap-x-2 rounded-md p-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50",
              params.userId === otherMember.id &&
                "bg-zinc-700/20 dark:bg-zinc-700",
            )}
          >
            <UserAvatar
              src={otherMember.image}
              name={otherMember.displayName ?? otherMember.name}
              className="size-8 md:size-8"
            />
            <div className="flex w-full pl-2 text-left">
              <p
                className={cn(
                  "w-32 truncate text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300",
                  params.userId === otherMember.id &&
                    "text-primary dark:text-zinc-200 dark:group-hover:text-white",
                )}
              >
                {otherMember.displayName ?? otherMember.name}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
