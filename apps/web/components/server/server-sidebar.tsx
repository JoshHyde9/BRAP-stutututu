import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { api } from "@workspace/api";
import { ChannelType } from "@workspace/db";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

import { getServerSession } from "@/lib/get-server-session";
import { channelIconMap, roleIconMap } from "@/lib/iconMaps";

import { ServerHeader } from "@/components/server/server-header";
import { ServerSearch } from "@/components/server/server-search";
import { ServerSidebarBottom } from "@/components/server/server-sidebar-bottom";

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
    (channel) => channel.type === ChannelType.TEXT,
  );
  const audioChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO,
  );
  const videoChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO,
  );

  const members = server.members.filter(
    (member) => member.userId !== session.user.id,
  );

  const loggedInUserRole = server.members.find(
    (member) => member.userId === session.user.id,
  )!.role;

  return (
    <div className="text-primary flex h-full w-full flex-col bg-[#f2f3f5] dark:bg-[#2b2d31]">
      <ServerHeader
        server={server}
        role={loggedInUserRole}
        userId={session.user.id}
      />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIconMap[channel.type],
                })),
              },
              {
                label: "Voice Channels",
                type: "channel",
                data: audioChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIconMap[channel.type],
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIconMap[channel.type],
                })),
              },
              {
                label: "Members",
                type: "member",
                data: members.map((member) => ({
                  id: member.id,
                  name:
                    member.nickname ??
                    member.user.displayName ??
                    member.user.name,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>
      </ScrollArea>

      <ServerSidebarBottom session={session} />
    </div>
  );
};
