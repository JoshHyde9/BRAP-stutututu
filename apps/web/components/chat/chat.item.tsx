import Image from "next/image";
import { format } from "date-fns";
import { FileIcon, X } from "lucide-react";

import { MemberRole } from "@workspace/db";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";

import { roleIconMap } from "@/lib/iconMaps";

import { ActionTooltip } from "../action-tooltip";
import { UserAvatar } from "../user-avatar";

type ChatItemProps = {
  message: {
    member: {
      nickname: string | null;
      role: MemberRole;
      user: {
        name: string;
        displayName: string | null;
        image: string | null;
      };
    };
    fileUrl?: string | null;
    content: string;
    createdAt: Date;
  };
};

export const ChatItem: React.FC<ChatItemProps> = ({ message }) => {
  // FIXME: File type rendering
  const fileType = message.fileUrl?.split(".").pop();

  const isPDF = fileType === "pdf" && message.fileUrl;
  const isImage = !isPDF && message.fileUrl;

  return (
    <div className="group relative flex w-full items-center p-4 transition hover:bg-black/5">
      <div className="group flex w-full items-start gap-x-2">
        <div className="cursor-pointer transition hover:drop-shadow-md">
          <UserAvatar
            name={message.member.user.name}
            src={message.member.user.image}
          />
        </div>
        <div className="flex w-full flex-col">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p className="cursor-pointer text-sm font-semibold hover:underline">
                {message.member.nickname ??
                  message.member.user.displayName ??
                  message.member.user.name}
              </p>
              <ActionTooltip label={message.member.role}>
                <p>{roleIconMap[message.member.role]}</p>
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {format(message.createdAt, "dd/MM/yyyy, HH:mm")}
            </span>
          </div>
          {isImage && (
            <Dialog>
              <DialogTrigger>
                <Image
                  src={message.fileUrl}
                  alt={message.content}
                  width={400}
                  height={300}
                  className="mt-2 cursor-pointer rounded-md object-contain"
                />
              </DialogTrigger>
              <DialogContent className="max-h-screen w-fit max-w-screen-lg overflow-hidden border-0 bg-transparent p-0">
                <DialogHeader>
                  <DialogTitle className="sr-only">Image</DialogTitle>
                  <DialogDescription className="h-screen w-screen">
                    <Image
                      src={message.fileUrl}
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
                href={message.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-discord ml-2 text-sm hover:underline dark:text-indigo-400"
              >
                PDF File
              </a>
            </div>
          )}
          {!message.fileUrl && (
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              {message.content}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
