"use client";

import { Loader2, ServerCrash } from "lucide-react";

import { useChannelMessages } from "@/hooks/use-channel-messages";

import { ChatWelcome } from "@/components/chat/chat-welcome";
import { ChatItem } from "@/components/chat/chat.item";

type ChatMessagesProps = {
  channelId: string;
  channelName: string;
};

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  channelId,
  channelName,
}) => {
  const {
    data: messages,
    isLoading,
    isError,
  } = useChannelMessages({ channelId });

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
    <div className="flex flex-1 flex-col overflow-y-auto py-4">
      <div className="flex-1">
        <ChatWelcome channelName={channelName} />
        <div className="mt-auto flex flex-col">
          <>
            {messages?.map((message) => (
              <ChatItem key={message.id} message={message} />
            ))}
          </>
        </div>
      </div>
    </div>
  );
};
