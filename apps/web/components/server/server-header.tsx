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
import { MemberRole } from "@workspace/db";

import { useModal } from "@/hooks/use-modal-store";

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

export const ServerHeader: React.FC<ServerHeaderProps> = ({ server, role, userId }) => {
  const { onOpen } = useModal();
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button className="w-full text-md font-semibold px-3 flex items-center h-12 transition border-neutral-200  border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 dark:border-neutral-800">
          {server.name}
          <ChevronDown className="size-5 ml-auto" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen("invite", { server })}
            className="cursor-pointer px-3 py-2 text-sm text-indigo-600 dark:text-indigo-400 focus:bg-indigo-400/20 dark:focus:bg-indigo-500/20 dark:focus:text-primary"
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
          <DropdownMenuItem className="cursor-pointer px-3 py-2 text-sm">
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
          <DropdownMenuItem className="cursor-pointer px-3 py-2 text-sm text-rose-500 focus:bg-rose-100/90 dark:focus:bg-rose-500/20">
            Leave Server <LogOut className="ml-auto size-4" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
