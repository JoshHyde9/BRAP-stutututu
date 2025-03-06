import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { ChannelType } from "@workspace/db";
import { api } from "@workspace/api";
import { getServerSession } from "@/lib/get-server-session";

import { ServerHeader } from "@/components/server/server-header";
import { ServerSidebarBottom } from "./server-sidebar-bottom";

type ServerSidebarProps = {
  serverId: string;
};

export const ServerSidebar: React.FC<ServerSidebarProps> = async ({
  serverId,
}) => {
  const session = await getServerSession();

  if (!session) {
    return redirect("/");
  }

  const { data: server } = await api.server
    .byIdWithMembersAndChannels({ id: serverId })
    .get({ fetch: { headers: await headers() } });

  if (!server) {
    return redirect("/");
  }

  const textChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const audioChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );

  const members = server.members.filter(
    (member) => member.userId !== session.user.id
  );

  const loggedInUserRole = server.members.find(
    (member) => member.userId === session.user.id
  )!.role;

  return (
    <div className="flex flex-col h-full w-full text-primary bg-[#f2f3f5] dark:bg-[#2b2d31]">
      <div className="flex-1">
        <ServerHeader server={server} role={loggedInUserRole} userId={session.user.id} />
      </div>

      <ServerSidebarBottom session={session} />
    </div>
  );
};
