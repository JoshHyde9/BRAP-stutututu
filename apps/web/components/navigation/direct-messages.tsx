"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare } from "lucide-react";

import { cn } from "@workspace/ui/lib/utils";

import { ActionTooltip } from "@/components/action-tooltip";

export const DirectMessages = () => {
  const pathname = usePathname();

  return (
    <ActionTooltip side="right" label="Direct Messages" align="center">
      <Link href="/friends/all" className="group relative flex items-center">
        <div
          className={cn(
            "bg-primary absolute left-0 w-[4px] rounded-r-full transition-all",
            pathname !== "/conversation" && "group-hover:h-[20px]",
            pathname === "/conversation" && "h-[36px]",
          )}
        />
        <div
          className={cn(
            "bg-primary-foreground group-hover:bg-discord group relative mx-3 flex size-[48px] items-center justify-center overflow-hidden rounded-[24px] transition group-hover:rounded-[16px]",
            pathname === "/conversation" &&
              "bg-discord rounded-[16px] text-zinc-100",
          )}
        >
          <MessageSquare
            className={cn(
              "text-zinc-600 group-hover:text-zinc-200 dark:text-zinc-300",
              pathname === "/conversation" && "text-zinc-300",
            )}
          />
        </div>
      </Link>
    </ActionTooltip>
  );
};
