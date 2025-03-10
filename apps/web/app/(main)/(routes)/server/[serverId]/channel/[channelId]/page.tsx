import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { api } from "@workspace/api";

import { getServerSession } from "@/lib/get-server-session";

import { ChatHeader } from "@/components/chat/chat-header";

type ChannelIdPageProps = {
  params: Promise<{ serverId: string; channelId: string }>;
};

const ChannelIdPage: React.FC<ChannelIdPageProps> = async ({ params }) => {
  const session = await getServerSession();
  const headerStore = await headers();

  const { serverId, channelId } = await params;

  if (!session) {
    return redirect("/");
  }

  const { data: channel } = await api.channel
    .byId({ channelId })
    .get({ fetch: { headers: headerStore } });

  const { data: loggedInMember } = await api.member
    .loggedInUserServerMember({ serverId })
    .get({ fetch: { headers: headerStore } });

  if (!channel || !loggedInMember) {
    return redirect("/");
  }

  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#313338]">
      <ChatHeader type="channel" name={channel.name} serverId={channel.serverId} />
    </div>
  );
};

export default ChannelIdPage;
