import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { api } from "@workspace/api";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

import { useModal } from "@/hooks/use-modal-store";

import { UserAvatar } from "@/components/user-avatar";

type ServerBansProps = {
  serverId?: string;
};

export const ServerBans: React.FC<ServerBansProps> = ({ serverId }) => {
  const { onOpen } = useModal();
  const serverBans = async () => {
    const { data, error } = await api.server.bans({ serverId }).get();

    if (error) {
      throw error;
    }

    return data;
  };

  const { data: bans, isPending } = useQuery({
    queryKey: ["serverBans"],
    queryFn: serverBans,
  });

  if (isPending) {
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center">
        <Loader2 className="my-4 size-7 animate-spin text-zinc-500" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading bans...
        </p>
      </div>
    );
  }

  if (bans?.length === 0) {
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          There are no banned users!
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="px-2 pb-2">
      {bans?.map((ban) => (
        <div
          key={ban.id}
          className="group mb-1 flex w-full cursor-pointer items-center gap-x-2 rounded-md p-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50"
          onClick={() => onOpen("unbanUser", { ban, serverId })}
        >
          <UserAvatar name={ban.user.name} src={ban.user.image} />
          <p>{ban.user.displayName ?? ban.user.name}</p>
          <span>({ban.user.name})</span>
        </div>
      ))}
    </ScrollArea>
  );
};
