"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

export const FriendsTabs = () => {
  const pathname = usePathname();
  return (
    <div className="flex gap-x-2">
      <Link href="/friends/all">
        <Button variant="ghost" size="sm" className={cn("px-3", pathname.includes("all") && "bg-muted")}>
          All
        </Button>
      </Link>
      <Link href="/friends/pending">
        <Button variant="ghost" size="sm" className={cn("px-3", pathname.includes("pending") && "bg-muted")}>
          Pending
        </Button>
      </Link>
      <Link href="/friends/requests">
        <Button variant="ghost" size="sm" className={cn("px-3", pathname.includes("requests") && "bg-muted")}>
          Requests
        </Button>
      </Link>
      <Link href="/friends/add-friend">
        <Button size="sm">Add Friend</Button>
      </Link>
    </div>
  );
};
