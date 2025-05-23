"use client";

import type { Session } from "@workspace/auth";

import { type ComponentRef, useRef } from "react";
import { differenceInMinutes } from "date-fns";
import { Loader2, ServerCrash } from "lucide-react";

import { Separator } from "@workspace/ui/components/separator";

import { useChatScroll } from "@/hooks/use-chat-scroll";
import { useConversationMessages } from "@/hooks/use-conversation-messages";
import { formatDateLabel } from "@/lib/helpers";

import { ChatWelcome } from "@/components/chat/chat-welcome";
import { ConversationItem } from "@/components/conversation/conversation-item";

const TIME_THRESHOLD = 5;

type ConversationMessagesProps = {
  conversationId: string;
  otherUsername: string;
  loggedInUser: Session["user"];
  targetId: string;
};

export const ConversationMessages: React.FC<ConversationMessagesProps> = ({
  conversationId,
  otherUsername,
  loggedInUser,
  targetId,
}) => {
  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    groupedMessages,
  } = useConversationMessages({ conversationId, targetId });

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
      {!hasNextPage && <ChatWelcome otherUsername={otherUsername} />}
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
              <Separator className="absolute left-0 right-0 top-1/2 border border-t border-zinc-200/20 dark:border-zinc-700" />
              <span className="relative inline-block rounded-full bg-zinc-200 px-4 py-1 text-xs shadow dark:bg-zinc-700">
                {formatDateLabel(dateKey)}
              </span>
            </div>
            {messages.map((message, i) => {
              const prevMessage = messages[i - 1];
              const isCompact =
                prevMessage &&
                prevMessage.user.id === message.user.id &&
                differenceInMinutes(
                  new Date(message.createdAt),
                  new Date(prevMessage.createdAt),
                ) < TIME_THRESHOLD;

              return (
                <ConversationItem
                  key={message.id}
                  conversationId={conversationId}
                  message={message}
                  isCompact={isCompact}
                  loggedInUser={loggedInUser}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};
