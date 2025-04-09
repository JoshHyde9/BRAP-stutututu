import { MoreHorizontal, UserPlus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";

import { ActionTooltip } from "@/components/action-tooltip";

import { PopoverActionButton } from "./popover-action-button";

export const ProfilePopoverActions = () => {
  return (
    <div className="flex justify-end gap-x-2 p-2">
      <PopoverActionButton>
        <button>
          <ActionTooltip label="Add Friend">
            <UserPlus className="size-4" />
          </ActionTooltip>
        </button>
      </PopoverActionButton>
      <PopoverActionButton>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button>
              <ActionTooltip label="More">
                <MoreHorizontal className="size-5" />
              </ActionTooltip>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" className="ml-2">
            <DropdownMenuItem className="cursor-pointer px-3 py-2 text-sm">
              View Full Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer px-3 py-2 text-sm">
              Invite to Server
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer px-3 py-2 text-sm text-rose-500 focus:bg-rose-100/90 dark:focus:bg-rose-500/20">
              Report User Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer px-3 py-2 text-sm text-rose-500 focus:bg-rose-100/90 dark:focus:bg-rose-500/20">
              Block
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer px-3 py-2 text-sm">
              Copy User ID
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </PopoverActionButton>
    </div>
  );
};
