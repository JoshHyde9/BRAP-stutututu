import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { api } from "@workspace/api";

import { getServerSession } from "@/lib/get-server-session";

import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/chat/media-room";

type ChannelIdPageProps = {
  params: Promise<{ serverId: string; channelId: string }>;
};

const ChannelIdPage: React.FC<ChannelIdPageProps> = async ({ params }) => {
  const session = await getServerSession();
  const headerStore = await headers();
  const queryClient = new QueryClient();

  const { serverId, channelId } = await params;

  if (!session) {
    return redirect("/");
  }

  const { data: channel } = await api.channel
    .byId({ channelId })
    .get({ fetch: { headers: headerStore } });

  const loggedInMember = await queryClient.fetchQuery({
    queryKey: ["loggedInMember", serverId],
    queryFn: async () => {
      const { data: loggedInMember } = await api.member
        .loggedInUserServerMember({ serverId })
        .get({ fetch: { headers: headerStore } });

      return loggedInMember;
    },
  });

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["messages", channelId],
    queryFn: async ({
      pageParam = undefined,
    }: {
      pageParam: string | undefined;
    }) => {
      const { data, error } = await api.message.channelMessages.get({
        query: { channelId: channelId, cursor: pageParam },
        fetch: { headers: headerStore },
      });

      if (error) {
        Promise.reject(new Error(error.value.message));
      }

      return data;
    },
    initialPageParam: "",
  });

  if (!channel || !loggedInMember) {
    return redirect("/");
  }

  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#313338]">
      <ChatHeader
        type="channel"
        name={channel.name}
        serverId={channel.serverId}
      />
      {channel.type === "TEXT" && (
        <>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <ChatMessages
              channelName={channel.name}
              channelId={channel.id}
              serverId={channel.serverId}
              loggedInMember={loggedInMember}
            />
          </HydrationBoundary>
          <ChatInput
            name={channel.name}
            type="channel"
            queryParams={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
          />
        </>
      )}
      {channel.type === "AUDIO" && (
        <MediaRoom chatId={channel.id} audio={true} video={false} />
      )}
      {channel.type === "VIDEO" && (
        <MediaRoom chatId={channel.id} audio={true} video={true} />
      )}
    </div>
  );
};

export default ChannelIdPage;
