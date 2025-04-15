"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { FileIcon, Pin } from "lucide-react";

import { api } from "@workspace/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

import { formatDate } from "@/lib/helpers";

import { ActionTooltip } from "@/components/action-tooltip";
import { UserAvatar } from "@/components/user-avatar";

type PinnedMessagesProps = {
  channelId: string;
};

export const PinnedMessages: React.FC<PinnedMessagesProps> = ({
  channelId,
}) => {
  const { data: messages } = useQuery({
    queryKey: ["pinnedMessages", channelId],
    queryFn: async () => {
      const { data } = await api.channel.pinnedMessages({ channelId }).get();
      return data;
    },
  });

  return (
    <Popover>
      <PopoverTrigger className="ml-auto">
        <ActionTooltip label="Pinned Messages">
          <Pin className="size-5 rotate-45 text-zinc-500 dark:text-zinc-400" />
        </ActionTooltip>
      </PopoverTrigger>
      <PopoverContent className="lg:w-xl w-fit px-0 dark:bg-[#313338]">
        <div className="flex items-center gap-x-2 border-b border-zinc-200 p-3 dark:border-zinc-700">
          <Pin className="rotate-45" />
          <span className="text-xl font-bold">Pinned Messages</span>
        </div>

        {!messages || messages.length <= 0 ? (
          <div>No pinned messages</div>
        ) : (
          <ScrollArea className="px-4 lg:h-[1000px]">
            <div className="flex flex-col gap-y-2">
              {messages.map(({ message }) => {
                const fileType = message.fileUrl?.split(".").pop();

                const isPDF = fileType === "pdf" && message.fileUrl;
                const isImage = !isPDF && message.fileUrl;

                return (
                  <div
                    key={message.id}
                    className="flex flex-col gap-x-2 rounded-md border border-b border-zinc-200 p-2 first:rounded-t-none first:border-t-0 dark:border-zinc-700"
                  >
                    <div className="flex gap-x-2">
                      <UserAvatar
                        src={message.member.user.image}
                        name={message.member.user.name}
                      />
                      <div className="flex items-center gap-x-2">
                        <p className="font-semibold">
                          {message.member.user.name}
                        </p>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                          {formatDate(message.createdAt)}
                        </span>
                      </div>
                    </div>

                    {isImage && (
                      <Dialog>
                        <DialogTrigger>
                          <div className="flex w-full justify-center">
                            <Image
                              src={message.fileUrl!}
                              alt={message.content}
                              width={400}
                              height={300}
                              className="mt-2 cursor-pointer rounded-md object-contain"
                            />
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-h-screen w-fit max-w-screen-lg overflow-hidden border-0 bg-transparent p-0">
                          <DialogHeader>
                            <DialogTitle className="sr-only">Image</DialogTitle>
                            <DialogDescription className="h-screen w-screen">
                              <Image
                                src={message.fileUrl!}
                                alt={message.content}
                                fill
                                className="max-h-[90vh] w-auto max-w-full object-contain"
                              />
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    )}
                    {isPDF && (
                      <div className="relative mt-2 flex items-center rounded-md bg-neutral-300/10 p-2">
                        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
                        <a
                          href={message.fileUrl!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-discord ml-2 text-sm hover:underline dark:text-indigo-400"
                        >
                          PDF File
                        </a>
                      </div>
                    )}
                    {!message.fileUrl && (
                      <p className="mt-2 text-zinc-600 dark:text-zinc-300">
                        {message.content}{" "}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
};
