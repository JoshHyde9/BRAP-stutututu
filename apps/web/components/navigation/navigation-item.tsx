"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@workspace/ui/lib/utils";
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

  return (
    <ActionTooltip side="right" label={name} align="center">
      <button onClick={() => router.push(`/server/${id}`)} className="group relative flex items-center">
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            params.serverId !== id && "group-hover:h-[20px]",
            params.serverId === id ? "h-[36px]" : "h-[8px]"
          )}
        />
        <div
          className={cn(
            "relative group flex mx-3 size-[48px] rounded-[24px] group-hover:rounded-[16px] transit overflow-hidden",
            params.serverId === id && "bg-primary/10 text-primary rounded-[16px]"
          )}
        >
            <Image fill src={imageUrl} alt={name} />
        </div>
      </button>
    </ActionTooltip>
  );
};
