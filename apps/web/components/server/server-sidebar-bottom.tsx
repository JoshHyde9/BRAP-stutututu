import type { Session } from "@workspace/auth";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { UserSettings } from "../navigation/user-settings";

type ServerSidebarBottomProps = {
  session: Session;
};

export const ServerSidebarBottom: React.FC<ServerSidebarBottomProps> = ({
  session,
}) => {
  return (
    <div className="flex items-center justify-between p-3 bg-muted-foreground/30 dark:bg-[#222427]">
      <div className="flex items-center gap-x-2">
        <div>
          <Avatar className="size-7 md:size-10">
            <AvatarImage src={session.user.image} alt={session.user.name} />
            <AvatarFallback>{session.user.name[0]}</AvatarFallback>
          </Avatar>
        </div>
        <div className="w-fit">
          {/* TODO: Add user display name */}
          <h3 className="font-medium">{session.user.name}</h3>
          <h6 className="font-medium text-xs text-zinc-600">
            {session.user.name}
          </h6>
        </div>
      </div>
        <UserSettings />
    </div>
  );
};
