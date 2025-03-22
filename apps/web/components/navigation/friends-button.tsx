"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRound } from "lucide-react";

import { cn } from "@workspace/ui/lib/utils";

export const FriendsButton = () => {
  const pathname = usePathname();
  return (
    <Link href="/friends" className="w-full">
      <button
        className={cn(
          "group mb-1 flex w-full items-center gap-x-2 rounded-md p-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50",
          pathname.includes("friends") && "bg-zinc-700/20 dark:bg-zinc-700",
        )}
      >
        <UserRound className="size-8 text-zinc-600 md:size-8 dark:text-zinc-200" />
        <div className="flex w-full pl-2 text-left">
          <p className="w-32 truncate font-semibold text-zinc-600 transition group-hover:text-zinc-600 dark:text-zinc-300 dark:group-hover:text-white">
            Friends
          </p>
        </div>
      </button>
    </Link>
  );
};
