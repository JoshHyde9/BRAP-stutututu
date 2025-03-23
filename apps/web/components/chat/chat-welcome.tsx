import { Hash } from "lucide-react";

type ChannelProps = {
  channelName: string;
  otherUsername?: never;
};

type ConversationProps = {
  channelName?: never;
  otherUsername: string;
};

type ChatWelcomeProps = ChannelProps | ConversationProps;

export const ChatWelcome: React.FC<ChatWelcomeProps> = ({
  channelName,
  otherUsername,
}) => {
  return (
    <div className="mb-4 space-y-2 px-4">
      {channelName && (
        <div className="flex size-[75px] items-center justify-center rounded-full bg-zinc-500 dark:bg-zinc-700">
          <Hash className="size-12 text-white" />
        </div>
      )}

      <p className="text-xl font-bold md:text-3xl">{channelName ? `Welcome to ${channelName}` : otherUsername}</p>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        This is the start of something beautiful
      </p>
    </div>
  );
};
