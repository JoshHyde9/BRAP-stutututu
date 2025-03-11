import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { api } from "@workspace/api";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

import { getServerSession } from "@/lib/get-server-session";

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
              data: conversations && conversations.map((conversation) => {
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
        <div className="space-y-[2px]">
          {conversations &&
            conversations.map((conversation) => {
              const otherUser =
                conversation.userOne.id === session.user.id
                  ? conversation.userTwo
                  : conversation.userOne;
              return <ServerMember key={otherUser.id} user={otherUser} />;
            })}
        </div>
      </ScrollArea>

      <ServerSidebarBottom session={session} />
    </div>
  );
};
