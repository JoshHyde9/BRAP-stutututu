import type { MemberRole } from "@workspace/db";

import {
  ChevronRight,
  Copy,
  CornerUpLeft,
  MoreVertical,
  Pencil,
  Trash,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";

import { ActionTooltip } from "@/components/action-tooltip";

type MessageToolbarMoreProps = {
  loggedInMember: {
    userId: string;
    role: MemberRole;
  };
  messageUser: {
    userId: string;
    role: MemberRole;
  };
};

export const MessageToolbarMore: React.FC<MessageToolbarMoreProps> = ({
  loggedInMember,
  messageUser,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <ActionTooltip label="More">
          <MoreVertical className="ml-auto size-4 cursor-pointer text-zinc-500 transition hover:text-zinc-600 dark:hover:text-zinc-300" />
        </ActionTooltip>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="left"
        className="w-52 text-black dark:text-neutral-400"
      >
        <DropdownMenuItem className="cursor-pointer px-3 py-2 text-sm">
          Add Reaction <ChevronRight className="ml-auto size-4" />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {messageUser.userId === loggedInMember.userId && (
          <DropdownMenuItem className="cursor-pointer px-3 py-2 text-sm">
            Edit Message <Pencil className="ml-auto size-4" />
          </DropdownMenuItem>
        )}

        <DropdownMenuItem className="cursor-pointer px-3 py-2 text-sm">
          Reply <CornerUpLeft className="ml-auto size-4" />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer px-3 py-2 text-sm">
          Copy Text <Copy className="ml-auto size-4" />
        </DropdownMenuItem>
        {messageUser.userId === loggedInMember.userId ||
        loggedInMember.role === "ADMIN" ||
        (messageUser.role == "GUEST" && loggedInMember.role === "MODERATOR") ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer px-3 py-2 text-sm text-rose-500 focus:bg-rose-100/90 dark:focus:bg-rose-500/20">
              Delete Message <Trash className="ml-auto size-4" />
            </DropdownMenuItem>
          </>
        ) : (
          false
        )}
        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer px-3 py-2 text-sm">
          Copy Message ID{" "}
          <span className="bg-muted-foreground rounded-xs ml-auto inline-flex size-4 items-center justify-center text-xs font-bold text-white dark:text-black">
            ID
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
