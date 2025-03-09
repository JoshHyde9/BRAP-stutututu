"use client";

import type { ServerWithMembers } from "@/lib/types";

import {
  ChevronDown,
  LogOut,
  Pencil,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from "lucide-react";

import { useModal } from "@/hooks/use-modal-store";
import { MemberRole } from "@workspace/db";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";

type ServerHeaderProps = {
  server: ServerWithMembers;
  role: MemberRole;
  userId: string;
};

export const ServerHeader: React.FC<ServerHeaderProps> = ({
  server,
  role,
  userId,
}) => {
  const { onOpen } = useModal();
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button className="text-md flex h-12 w-full items-center border-b-2 border-neutral-200 px-3 font-semibold transition hover:bg-zinc-700/10 dark:border-neutral-800 dark:hover:bg-zinc-700/50">
          {server.name}
          <ChevronDown className="ml-auto size-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 space-y-[2px] text-xs font-medium text-black dark:text-neutral-400">
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen("invite", { server })}
            className="dark:focus:text-primary cursor-pointer px-3 py-2 text-sm text-indigo-600 focus:bg-indigo-400/20 dark:text-indigo-400 dark:focus:bg-indigo-500/20"
          >
            Invite People <UserPlus className="ml-auto size-4" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("editServer", { server })}
            className="cursor-pointer px-3 py-2 text-sm"
          >
            Server Settings <Settings className="ml-auto size-4" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("members", { server })}
            className="cursor-pointer px-3 py-2 text-sm"
          >
            Manage Members <Users className="ml-auto size-4" />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem
            className="cursor-pointer px-3 py-2 text-sm"
            onClick={() => onOpen("createChannel", { server })}
          >
            Create Channel <PlusCircle className="ml-auto size-4" />
          </DropdownMenuItem>
        )}
        {isModerator && <DropdownMenuSeparator />}
        <DropdownMenuItem
          className="cursor-pointer px-3 py-2 text-sm"
          onClick={() => onOpen("editServerProfile", { server, userId })}
        >
          Update Server Profile <Pencil className="ml-auto size-4" />
        </DropdownMenuItem>
        {isModerator && <DropdownMenuSeparator />}
        {isAdmin && (
          <DropdownMenuItem className="cursor-pointer px-3 py-2 text-sm text-rose-500 focus:bg-rose-100/90 dark:focus:bg-rose-500/20">
            Delete Server <Trash className="ml-auto size-4" />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem
            className="cursor-pointer px-3 py-2 text-sm text-rose-500 focus:bg-rose-100/90 dark:focus:bg-rose-500/20"
            onClick={() => onOpen("leaveServer", { server })}
          >
            Leave Server <LogOut className="ml-auto size-4" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
