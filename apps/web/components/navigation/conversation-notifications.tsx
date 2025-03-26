"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSocket } from "@/providers/ws-provider";

import { cn } from "@workspace/ui/lib/utils";

import { UserAvatar } from "../user-avatar";

export const ConversationNotifications = () => {
  const {
    notifications,
    actions: { clearConversationNotifications },
  } = useSocket();
  const router = useRouter();
  const pathname = usePathname();

  const filteredNotifications = Object.entries(
    notifications.conversations,
  ).filter(([userId]) => {
    return !pathname.includes(`/conversation/${userId}`);
  });

  if (Object.keys(filteredNotifications).length <= 0) {
    return;
  }

  return (
    <div
      className={cn(
        "flex-col space-y-2",
        filteredNotifications ? "flex" : "hidden",
      )}
    >
      {filteredNotifications.map(([userId, notification]) => (
        <button
          key={userId}
          onClick={() => {
            clearConversationNotifications(userId);
            router.push(`/conversation/${userId}`);
          }}
          className="group relative flex items-center"
        >
          <div
            className={cn(
              "bg-primary absolute left-0 w-[4px] rounded-r-full transition-all group-hover:h-[20px]",
            )}
          />
          <div
            className={cn(
              "group relative mx-3 flex size-[48px] overflow-hidden rounded-[24px] transition group-hover:rounded-[16px]",
            )}
          >
            <Image fill src={notification.image!} alt={notification.name} />
          </div>
          {notification.count > 0 && (
            <div className="absolute -bottom-2 right-2 flex min-h-[20px] min-w-[20px] items-center justify-center rounded-full bg-rose-500 text-xs text-white">
              {notification.count}
            </div>
          )}
        </button>
      ))}
    </div>
  );
};
