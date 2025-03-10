import { Hash } from "lucide-react";

import { MobileToggle } from "@/components/mobile-toggle";

type ChatHeaderProps = {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string;
};

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  name,
  serverId,
  type,
  imageUrl,
}) => {
  return (
    <div className="flex h-12 items-center border-b-2 border-neutral-200 px-3 font-semibold dark:border-neutral-800">
      <MobileToggle serverId={serverId} />
      {type === "channel" && (
        <Hash className="mr-2 size-5 text-zinc-500 dark:text-zinc-400" />
      )}
      <p className="font-semibold">{name}</p>
    </div>
  );
};
