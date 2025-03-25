"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSocket } from "@/providers/ws-provider";

import { cn } from "@workspace/ui/lib/utils";

export const ConversationNotifications = () => {
  const { conversationNotifications, clearConversationNotifications } =
    useSocket();
  const router = useRouter();
  const pathname = usePathname();

  const filteredNotifications = Object.entries(
    conversationNotifications,
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
          className="relative size-[48px] cursor-pointer rounded-full transition-opacity"
        >
          <Image
            src={notification.image}
            alt={`Notification for user ${userId}`}
            className="rounded-full"
            fill
          />
          {notification.count > 0 && (
            <div className="absolute bottom-0 right-0 flex min-h-[20px] min-w-[20px] items-center justify-center rounded-full bg-rose-500 text-xs text-white">
              {notification.count}
            </div>
          )}
        </button>
      ))}
    </div>
  );
};
