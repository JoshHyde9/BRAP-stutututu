"use client";

import { Loader2 } from "lucide-react";

import { useChannelMessages } from "@/hooks/use-channel-messages";

type ChatMessagesProps = {
  channelId: string;
};

export const ChatMessages: React.FC<ChatMessagesProps> = ({ channelId }) => {
  const { data: messages, isLoading } = useChannelMessages({ channelId });

  return (
    <section>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="size-10 animate-spin" />
        </div>
      ) : (
        messages &&
        messages.map((message) => (
          <div key={message.id} className="my-3">
            <p>{message.member.nickname ?? message.member.user.displayName ??message.member.user.name}</p>
            <span>{message.content}</span>
          </div>
        ))
      )}
    </section>
  );
};
