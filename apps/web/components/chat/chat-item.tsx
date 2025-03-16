import type { Session } from "@workspace/auth";

import { useEffect, useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Edit, FileIcon, Trash } from "lucide-react";

import { MemberRole } from "@workspace/db";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";

import { roleIconMap } from "@/lib/iconMaps";

import { ActionTooltip } from "@/components/action-tooltip";
import { EditMessage } from "@/components/chat/edit-message";
import { UserAvatar } from "@/components/user-avatar";

type ChatItemProps = {
  session: Session;
  serverId: string;
  channelId: string;
  message: {
    member: {
      nickname: string | null;
      role: MemberRole;
      user: {
        id: string;
        name: string;
        displayName: string | null;
        image: string | null;
      };
    };
    id: string;
    fileUrl?: string | null;
    content: string;
    createdAt: Date;
  };
};

export const ChatItem: React.FC<ChatItemProps> = ({
  message,
  channelId,
  serverId,
  session,
}) => {
  // FIXME: File type rendering
  const fileType = message.fileUrl?.split(".").pop();

  const isPDF = fileType === "pdf" && message.fileUrl;
  const isImage = !isPDF && message.fileUrl;

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsEditing(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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
          {isEditing && (
            <EditMessage
              queryParams={{
                serverId,
                channelId,
              }}
              messageId={message.id}
              content={message.content}
              setIsEditing={setIsEditing}
            />
          )}
        </div>
      </div>
      {session.user.id === message.member.user.id && (
        <div className="absolute -top-2 right-5 hidden items-center gap-x-2 rounded-sm border bg-white p-1 group-hover:flex dark:bg-zinc-800">
          {!message.fileUrl && (
            <ActionTooltip label="Edit">
              <Edit
                className="ml-auto size-4 cursor-pointer text-zinc-500 transition hover:text-zinc-600 dark:hover:text-zinc-300"
                onClick={() => setIsEditing(!isEditing)}
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash className="ml-auto size-4 cursor-pointer text-rose-500 transition hover:text-rose-600 dark:hover:text-rose-300" />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};
