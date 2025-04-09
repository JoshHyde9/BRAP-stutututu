import type { MemberRole } from "@workspace/db";

import { Button } from "@workspace/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";

import { roleIconMap } from "@/lib/iconMaps";

import { UserAvatar } from "../user-avatar";
import { ProfilePopoverActions } from "./profile-popover-actions";

type ProfilePopoverProps = {
  displayName: string;
  username: string;
  image: string | null;
  role: MemberRole;
  children: React.ReactNode;
};

export const ProfilePopover: React.FC<ProfilePopoverProps> = ({
  username,
  displayName,
  image,
  role,
  children,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="m-0 p-0 text-base font-semibold hover:bg-transparent"
        >
          {children}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="right"
        className="min-w-80 bg-[#f2f3f5] p-1 dark:bg-[#2b2d31]"
      >
        <div className="flex flex-col gap-3">
          <div className="relative">
            {/* TODO: Create ability for member to create custom banner colour */}
            <div className="min-h-28 rounded-t-md bg-orange-400">
              <ProfilePopoverActions />
            </div>
            <div className="mb-7">
              <UserAvatar
                className="top-2/5 absolute left-2.5 size-14 border-4 border-black md:size-24"
                name={username}
                src={image}
              />
            </div>
          </div>
          <div>
            <div className="flex flex-col gap-3 px-4 pb-1 pt-2">
              <p className="font-bold hover:underline">{displayName}</p>
              <p className="text-muted-foreground text-sm hover:underline">
                {username}
              </p>
              <div className="flex cursor-default gap-x-2">
                <div className="flex items-center justify-center gap-x-1 rounded-md border px-2 py-0.5">
                  <p className="[&>svg]:ml-0">{roleIconMap[role]}</p>
                  <span className="text-xs capitalize">
                    {role.toLowerCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
