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
      <Link href="/conversation" className="group relative flex items-center">
        <div
          className={cn(
            "bg-primary absolute left-0 w-[4px] rounded-r-full transition-all",
            pathname !== "/conversation" && "group-hover:h-[20px]",
            pathname === "/conversation" && "h-[36px]",
          )}
        />
        <div
          className={cn(
            "bg-primary-foreground group relative mx-3 flex size-[48px] items-center justify-center overflow-hidden rounded-[24px] transition group-hover:rounded-[16px] group-hover:bg-discord",
            pathname === "/conversation" &&
              "bg-discord text-primary rounded-[16px]",
          )}
        >
          <MessageSquare className="text-zinc-600 dark:text-zinc-300 group-hover:text-zinc-200" />
        </div>
      </Link>
    </ActionTooltip>
  );
};
