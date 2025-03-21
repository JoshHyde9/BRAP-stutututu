import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, UserRound } from "lucide-react";

import { api } from "@workspace/api";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

import { getServerSession } from "@/lib/get-server-session";

import { ActionTooltip } from "@/components/action-tooltip";
import { ServerMember } from "@/components/server/server-member";
import { ServerSearch } from "@/components/server/server-search";
import { ServerSidebarBottom } from "@/components/server/server-sidebar-bottom";

export const ConversationSidebar: React.FC = async () => {
  const session = await getServerSession();

  const { data: conversations } = await api.conversation.all.get({
    fetch: { headers: await headers() },
  });

  if (!session) {
    return redirect("/");
  }

  return (
    <div className="text-primary flex h-full w-full flex-col bg-[#f2f3f5] dark:bg-[#2b2d31]">
      <div className="flex h-12 items-center border-b-2 border-neutral-200 px-3 dark:border-neutral-800">
        <ServerSearch
          searchTitle="Type for a member..."
          data={[
            {
              label: "Members",
              type: "member",
              data:
                conversations &&
                conversations.map((conversation) => {
                  const otherUser =
                    conversation.userOne.id === session.user.id
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
      <ScrollArea className="flex-1 px-3">
        <div className="mt-1 flex">
          <Link href="/conversation" className="w-full">
            <button className="group mb-1 flex w-full items-center gap-x-2 rounded-md bg-zinc-700/20 p-2 transition hover:bg-zinc-700/10 dark:bg-zinc-700 dark:hover:bg-zinc-700/50">
              <UserRound className="size-8 text-zinc-600 md:size-8 dark:text-zinc-200" />
              <div className="flex w-full pl-2 text-left">
                <p className="w-32 truncate font-semibold text-zinc-600 transition group-hover:text-zinc-600 dark:text-zinc-200 dark:group-hover:text-white">
                  Friends
                </p>
              </div>
            </button>
          </Link>
        </div>
        <div className="flex items-center justify-between py-2">
          <p className="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
            Direct Messages
          </p>
          <ActionTooltip label="Create Conversation" side="top">
            <button className="text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300">
              <Plus className="size-4" />
            </button>
          </ActionTooltip>
        </div>
        <div className="space-y-[2px]">
          {conversations &&
            conversations.map((conversation, i) => {
              const otherUser =
                conversation.userOne.id === session.user.id
                  ? conversation.userTwo
                  : conversation.userOne;
              return <ServerMember key={i} user={otherUser} />;
            })}
        </div>
      </ScrollArea>

      <ServerSidebarBottom session={session} />
    </div>
  );
};
