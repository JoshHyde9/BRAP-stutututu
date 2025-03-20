"use client";

import type { Member } from "@workspace/db";

import { ComponentRef, useRef } from "react";
import { Loader2, ServerCrash } from "lucide-react";

import { Separator } from "@workspace/ui/components/separator";

import { useChannelMessages } from "@/hooks/use-channel-messages";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import { formatDateLabel } from "@/lib/helpers";

import { ChatItem } from "@/components/chat/chat-item";
import { ChatWelcome } from "@/components/chat/chat-welcome";

type ChatMessagesProps = {
  channelId: string;
  channelName: string;
  serverId: string;
  loggedInMember: Member;
};

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  channelId,
  channelName,
  serverId,
  loggedInMember,
}) => {
  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    groupedMessages,
  } = useChannelMessages({
    channelId,
  });

  const chatRef = useRef<ComponentRef<"div">>(null);
  const bottomRef = useRef<ComponentRef<"div">>(null);

  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.messages.length ?? 0,
  });

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <Loader2 className="my-4 size-7 animate-spin text-zinc-500" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <ServerCrash className="my-4 size-7 text-zinc-500" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">UH OH</p>
      </div>
    );
  }

  return (
    <div ref={chatRef} className="flex flex-1 flex-col overflow-y-auto py-4">
      {!hasNextPage && <div className="flex-1" />}
      {!hasNextPage && <ChatWelcome channelName={channelName} />}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="my-4 size-7 animate-spin text-zinc-500" />
          ) : (
            <button onClick={() => fetchNextPage()}>
              Load previous messages
            </button>
          )}
        </div>
      )}
      <div className="mt-auto flex flex-col-reverse">
        {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
          <div key={dateKey}>
            <div className="relative my-2 text-center text-zinc-600 dark:text-zinc-300">
              <Separator className="absolute left-0 right-0 top-1/2 border-t border-zinc-700/20 dark:border-zinc-700" />
              <span className="broder relative inline-block rounded-full border-zinc-700/20 bg-zinc-300 px-4 py-1 text-xs shadow dark:border-zinc-700 dark:bg-zinc-700">
                {formatDateLabel(dateKey)}
              </span>
            </div>
            {messages.map((message) => (
              <ChatItem
                key={message.id}
                message={message}
                channelId={channelId}
                serverId={serverId}
                loggedInMember={loggedInMember}
              />
            ))}
          </div>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};
