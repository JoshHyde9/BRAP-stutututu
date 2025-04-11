"use client";

import Link from "next/link";

import { Channel, Server } from "@workspace/db";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

import { NavigationItem } from "@/components/navigation/navigation-item";

import { NavigationAction } from "./navigation-action";

type ServerWithGeneral = Server & {channels: Channel[]}

type ServerListProps = {
  servers: ServerWithGeneral[] | null;
};

export const ServerList: React.FC<ServerListProps> = ({ servers }) => {
  return (
    <ScrollArea className="w-full flex-1">
      {servers?.map((server) => (
        <Link key={server.id} href="/server/[id]" as={`/server/${server.id}/channel/${server.channels[0]?.id}`}>
          <div className="mb-4">
            <NavigationItem
              id={server.id}
              imageUrl={server.imageUrl}
              name={server.name}
            />
          </div>
        </Link>
      ))}
      <NavigationAction />
    </ScrollArea>
  );
};
