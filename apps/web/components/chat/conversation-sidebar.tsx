"use client";

import type { UserInfo } from "@/lib/types";
import type { Session } from "@workspace/auth";
import type { Conversation } from "@workspace/db";

import { ServerMember } from "@/components/server/server-member";
import { ServerSearch } from "@/components/server/server-search";

type ConversationSidebarProps = {
  loggedInUser: Pick<Session, "user">;
  conversations: Conversation & { userOne: UserInfo; userTwo: UserInfo }[];
};

export const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  conversations,
  loggedInUser,
}) => {
  return (
    <div className="text-primary flex h-full w-full flex-col bg-[#f2f3f5] dark:bg-[#2b2d31]">
      <div className="flex h-12 items-center border-b-2 border-neutral-200 px-3 dark:border-neutral-800">
        <ServerSearch
          searchTitle="Type for a member..."
          data={[
            {
              label: "Members",
              type: "member",
              data: conversations.map((conversation) => {
                const otherUser =
                  conversation.userOne.id === loggedInUser.user.id
                    ? conversation.userTwo
                    : conversation.userOne;
                return {
                  id: otherUser.id,
                  imageUrl: otherUser.image,
                  name: otherUser.displayName ?? otherUser.name,
                };
              }),
            },
          ]}
        />
      </div>
      <div className="space-y-[2px]">
        {conversations.map((conversation) => {
          const otherUser =
            conversation.userOne.id === loggedInUser.user.id
              ? conversation.userTwo
              : conversation.userOne;
          return <ServerMember key={otherUser.id} user={otherUser} />;
        })}
      </div>
    </div>
  );
};
