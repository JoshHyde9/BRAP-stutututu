import type { DirectMessageWithUser } from "@workspace/api";
import type { Session } from "@workspace/auth";

import { useEffect, useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Edit, FileIcon, MoreVertical } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { cn } from "@workspace/ui/lib/utils";

import { formatDate } from "@/lib/helpers";

import { ActionTooltip } from "@/components/action-tooltip";
import { DeleteMessage } from "@/components/chat/delete-message";
import { EditMessage } from "@/components/chat/edit-message";
import { UserAvatar } from "@/components/user-avatar";
import { EditConversationMessage } from "./edit-conversation-message";

type ConversationItem = {
  message: DirectMessageWithUser;
  isCompact: boolean | undefined;
  loggedInUser: Session["user"];
  conversationId: string;
};

export const ConversationItem: React.FC<ConversationItem> = ({
  message,
  isCompact,
  loggedInUser,
  conversationId,
}) => {
  // FIXME: File type rendering
  const fileType = message.fileUrl?.split(".").pop();

  const isPDF = fileType === "pdf" && message.fileUrl;
  const isImage = !isPDF && message.fileUrl;

  const [isEditing, setIsEditing] = useState(false);

  const isEdited = message.content !== message.originalContent;

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
    <div
      className={cn(
        "group relative flex w-full items-center px-4 py-1 transition hover:bg-black/5",
        !isCompact && "mt-4",
      )}
    >
      <div className={cn("start group flex w-full gap-x-2")}>
        {!isCompact ? (
          <div className="cursor-pointer transition hover:drop-shadow-md">
            <UserAvatar name={message.user.name} src={message.user.image} />
          </div>
        ) : (
          <span className="text-muted-foreground cursor-default pr-2 pt-1 text-xs opacity-0 group-hover:opacity-100">
            {format(message.createdAt, "hh:mm")}
          </span>
        )}
        <div className="flex w-full flex-col">
          {!isCompact ? (
            <div className="flex items-center gap-x-2">
              <div className="flex items-center">
                <p className="cursor-pointer font-semibold hover:underline">
                  {message.user.displayName ?? message.user.name}
                </p>
              </div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {formatDate(message.createdAt)}
              </span>
            </div>
          ) : (
            <span></span>
          )}
          {isImage && (
            <Dialog>
              <DialogTrigger>
                <Image
                  src={message.fileUrl!}
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
            <p className="text-zinc-600 dark:text-zinc-300">
              {message.content}{" "}
              {isEdited ? (
                <span className="text-muted-foreground text-xs">(edited)</span>
              ) : null}
            </p>
          )}
          {isEditing && (
            <EditConversationMessage
              messageId={message.id}
              content={message.content}
              setIsEditing={setIsEditing}
            />
          )}
        </div>
      </div>
      <div className="absolute -top-2 right-5">
        <div className="flex items-center gap-x-2 rounded-sm border bg-white p-1 opacity-0 transition-opacity group-hover:opacity-100 dark:bg-zinc-800">
          {message.user.id === loggedInUser.id && !message.fileUrl && (
            <>
              <ActionTooltip label="Edit">
                <Edit
                  className="ml-auto size-4 cursor-pointer text-zinc-500 transition hover:text-zinc-600 dark:hover:text-zinc-300"
                  onClick={() => setIsEditing(!isEditing)}
                />
              </ActionTooltip>
              <DeleteMessage
                messageId={message.id}
                conversationId={conversationId}
              />
            </>
          )}
          <ActionTooltip label="More">
            <MoreVertical className="ml-auto size-4 cursor-pointer text-zinc-500 transition hover:text-zinc-600 dark:hover:text-zinc-300" />
          </ActionTooltip>
        </div>
      </div>
    </div>
  );
};
