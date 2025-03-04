import type { Session } from "@workspace/auth";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { UserSettings } from "@/components/navigation/user-settings";
import { SignOut } from "../sign-out";

type ServerSidebarBottomProps = {
  session: Session;
};

export const ServerSidebarBottom: React.FC<ServerSidebarBottomProps> = ({
  session,
}) => {
  return (
    <Popover>
      <div className="flex items-center p-2 justify-between bg-muted-foreground/30 dark:bg-[#222427]">
        <PopoverTrigger asChild>
          <button className="flex items-center gap-x-2 py-1 px-2 rounded-sm transition hover:bg-accent-foreground/10">
            <div>
              <Avatar className="size-7 md:size-10">
                <AvatarImage src={session.user.image as string} alt={session.user.name} />
                <AvatarFallback>{session.user.name[0]}</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col items-start w-">
              {/* TODO: Add user display name */}
              <h3 className="font-medium overflow-hidden truncate w-24">Jim's Discord Account</h3>
              <h6 className="font-medium text-xs text-zinc-600">
                {session.user.name}
              </h6>
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent>
          <SignOut />
        </PopoverContent>
        <UserSettings />
      </div>
    </Popover>
  );
};
