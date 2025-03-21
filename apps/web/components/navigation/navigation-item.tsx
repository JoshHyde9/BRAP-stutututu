"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@workspace/ui/lib/utils";

import { useServerNotifications } from "@/hooks/use-server-notifications";

import { ActionTooltip } from "@/components/action-tooltip";

type NavigationItemProps = {
  id: string;
  imageUrl: string;
  name: string;
};

export const NavigationItem: React.FC<NavigationItemProps> = ({
  id,
  imageUrl,
  name,
}) => {
  const params = useParams<{ serverId: string }>();
  const router = useRouter();
  const { notifications, clearServerNotifications } = useServerNotifications({ serverId: id });

  return (
    <ActionTooltip side="right" label={name} align="center">
      <button
        onClick={() => {
          clearServerNotifications(id);
          router.push(`/server/${id}`);
        }}
        className="group relative flex items-center"
      >
        <div
          className={cn(
            "bg-primary absolute left-0 w-[4px] rounded-r-full transition-all",
            params.serverId !== id && "group-hover:h-[20px]",
            notifications[id]?.hasNotification && "h-[8px]",
            params.serverId === id && "h-[36px]",
          )}
        />
        <div
          className={cn(
            "transition group relative mx-3 flex size-[48px] overflow-hidden rounded-[24px] group-hover:rounded-[16px]",
            params.serverId === id &&
              "bg-primary/10 text-primary rounded-[16px]",
          )}
        >
          <Image fill src={imageUrl} alt={name} />
        </div>
      </button>
    </ActionTooltip>
  );
};
