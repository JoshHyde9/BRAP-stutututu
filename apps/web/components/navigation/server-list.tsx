"use client";

import { Server } from "@workspace/db";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

import { NavigationItem } from "@/components/navigation/navigation-item";

type ServerListProps = {
  servers: Server[] | null;
};

export const ServerList: React.FC<ServerListProps> = ({ servers }) => {
  return (
    <ScrollArea className="w-full flex-1">
      {servers?.map((server) => (
        <div key={server.id} className="mb-4">
          <NavigationItem
            id={server.id}
            imageUrl={server.imageUrl}
            name={server.name}
          />
        </div>
      ))}
    </ScrollArea>
  );
};
