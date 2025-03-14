import { Hash } from "lucide-react";

type ChannelWelcomeProps = {
  channelName: string;
};

export const ChatWelcome: React.FC<ChannelWelcomeProps> = ({ channelName }) => {
  return (
    <div className="mb-4 space-y-2 px-4">
      <div className="flex size-[75px] items-center justify-center rounded-full bg-zinc-500 dark:bg-zinc-700">
        <Hash className="size-12 text-white" />
      </div>

      <p className="text-xl font-bold md:text-3xl">Welcome to #{channelName}</p>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        This is the start of something beautiful
      </p>
    </div>
  );
};
