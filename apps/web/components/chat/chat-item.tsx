import type { MessageWithSortedReactions } from "@workspace/api";
import type { Member } from "@workspace/db";

import { useEffect, useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { CornerUpLeft, Edit, FileIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { useMediaQuery } from "@workspace/ui/hooks/use-media-query";
import { cn } from "@workspace/ui/lib/utils";

import { formatDate } from "@/lib/helpers";
import { roleIconMap } from "@/lib/iconMaps";

import { ActionTooltip } from "@/components/action-tooltip";
import { AddReaction } from "@/components/chat/add-reaction";
import { DeleteMessage } from "@/components/chat/delete-message";
import { EditMessage } from "@/components/chat/edit-message";
import { MessageReactions } from "@/components/chat/message-reactions";
import { MessageToolbarDrawer } from "@/components/chat/message-toolbar-drawer";
import { MessageToolbarMore } from "@/components/chat/message-toolbar-more";
import { ProfilePopover } from "@/components/profile/profile-popover";
import { UserAvatar } from "@/components/user-avatar";

import { PinMessage } from "./pinned-messages/create-pin";

type ChatItemProps = {
  loggedInMember: Member;
  serverId: string;
  channelId: string;
  message: MessageWithSortedReactions;
  isCompact: boolean | undefined;
};

export const ChatItem: React.FC<ChatItemProps> = ({
  message,
  channelId,
  serverId,
  loggedInMember,
  isCompact,
}) => {
  // FIXME: File type rendering
  const fileType = message.fileUrl?.split(".").pop();

  const isPDF = fileType === "pdf" && message.fileUrl;
  const isImage = !isPDF && message.fileUrl;

  const [isEditing, setIsEditing] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

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
      {/* TODO: Refactor */}
      {isDesktop ? (
        <div className={cn("start group flex w-full gap-x-2")}>
          {!isCompact ? (
            <div className="cursor-pointer transition hover:drop-shadow-md">
              <ProfilePopover
                image={message.member.user.image}
                username={message.member.user.name}
                displayName={
                  message.member.nickname ??
                  message.member.user.displayName ??
                  message.member.user.name
                }
                role={message.member.role}
              >
                <UserAvatar
                  name={message.member.user.name}
                  src={message.member.user.image}
                />
              </ProfilePopover>
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
                  <ProfilePopover
                    image={message.member.user.image}
                    username={message.member.user.name}
                    displayName={
                      message.member.nickname ??
                      message.member.user.displayName ??
                      message.member.user.name
                    }
                    role={message.member.role}
                  >
                    <p className="cursor-pointer font-semibold hover:underline">
                      {message.member.nickname ??
                        message.member.user.displayName ??
                        message.member.user.name}
                    </p>
                  </ProfilePopover>
                  <ActionTooltip label={message.member.role}>
                    <p>{roleIconMap[message.member.role]}</p>
                  </ActionTooltip>
                </div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {formatDate(message.createdAt)}
                </span>
              </div>
            ) : (
              <span />
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
                  <span className="text-muted-foreground text-xs">
                    (edited)
                  </span>
                ) : null}
              </p>
            )}

            {message.reactions && message.reactions.length > 0 && (
              <MessageReactions
                loggedInMember={loggedInMember}
                messageId={message.id}
                queryParams={{ channelId, serverId }}
                reactions={message.reactions}
              />
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
      ) : (
        <MessageToolbarDrawer
          queryParams={{ channelId, serverId }}
          messageId={message.id}
        >
          <div className={cn("start group flex w-full select-none gap-x-2")}>
            {!isCompact ? (
              <div className="cursor-pointer transition hover:drop-shadow-md">
                <ProfilePopover
                  image={message.member.user.image}
                  username={message.member.user.name}
                  displayName={
                    message.member.nickname ??
                    message.member.user.displayName ??
                    message.member.user.name
                  }
                  role={message.member.role}
                >
                  <UserAvatar
                    name={message.member.user.name}
                    src={message.member.user.image}
                  />
                </ProfilePopover>
              </div>
            ) : (
              <span className="text-muted-foreground -ml-1 cursor-default pt-1 text-xs opacity-0 group-hover:opacity-100 lg:ml-0 lg:pr-2">
                {format(message.createdAt, "hh:mm")}
              </span>
            )}
            <div className="flex w-full flex-col">
              {!isCompact && (
                <div className="flex items-center gap-x-2">
                  <div className="flex items-center">
                    <ProfilePopover
                      image={message.member.user.image}
                      username={message.member.user.name}
                      displayName={
                        message.member.nickname ??
                        message.member.user.displayName ??
                        message.member.user.name
                      }
                      role={message.member.role}
                    >
                      <p className="cursor-pointer font-semibold hover:underline">
                        {message.member.nickname ??
                          message.member.user.displayName ??
                          message.member.user.name}
                      </p>
                    </ProfilePopover>
                    <ActionTooltip label={message.member.role}>
                      <p>{roleIconMap[message.member.role]}</p>
                    </ActionTooltip>
                  </div>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {formatDate(message.createdAt)}
                  </span>
                </div>
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
                    <span className="text-muted-foreground text-xs">
                      (edited)
                    </span>
                  ) : null}
                </p>
              )}

              {message.reactions && message.reactions.length > 0 && (
                <MessageReactions
                  loggedInMember={loggedInMember}
                  messageId={message.id}
                  queryParams={{ channelId, serverId }}
                  reactions={message.reactions}
                />
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
        </MessageToolbarDrawer>
      )}

      <div className="absolute -top-2 right-5">
        <div className="flex items-center gap-x-2 rounded-sm border bg-white p-1 opacity-0 transition-opacity group-hover:opacity-100 dark:bg-zinc-800">
          <AddReaction
            queryParams={{ channelId, serverId }}
            messageId={message.id}
          />
          <ActionTooltip label="Reply">
            <CornerUpLeft className="ml-auto size-4 cursor-pointer text-zinc-500 transition hover:text-zinc-600 dark:hover:text-zinc-300" />
          </ActionTooltip>
          {message.member.user.id === loggedInMember.userId &&
            !message.fileUrl && (
              <ActionTooltip label="Edit">
                <Edit
                  className="ml-auto size-4 cursor-pointer text-zinc-500 transition hover:text-zinc-600 dark:hover:text-zinc-300"
                  onClick={() => setIsEditing(!isEditing)}
                />
              </ActionTooltip>
            )}
          {loggedInMember.role === "ADMIN" ||
          (message.member.role === "GUEST" &&
            loggedInMember.role === "MODERATOR") ? (
            <PinMessage channelId={message.channelId} messageId={message.id} />
          ) : (
            false
          )}
          {message.member.user.id === loggedInMember.userId ||
          loggedInMember.role === "ADMIN" ||
          (message.member.role === "GUEST" &&
            loggedInMember.role === "MODERATOR") ? (
            <DeleteMessage
              queryParams={{ channelId, serverId }}
              messageId={message.id}
            />
          ) : (
            false
          )}
          <MessageToolbarMore
            loggedInMember={{
              role: loggedInMember.role,
              userId: loggedInMember.userId,
            }}
            messageUser={{
              role: message.member.role,
              userId: message.member.userId,
            }}
          />
        </div>
      </div>
    </div>
  );
};
