import { Menu } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";

import { ConversationSidebar } from "./chat/conversation-sidebar";
import { NavigationSidebar } from "./navigation/navigation-sidebar";
import { ServerSidebar } from "./server/server-sidebar";

type MobileToggleProps = {
  type: "channel" | "conversation" | "friends";
  serverId?: string;
};

export const MobileToggle: React.FC<MobileToggleProps> = ({
  serverId,
  type,
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex w-full flex-row gap-0 p-0">
        <div className="w-[72px]">
          <SheetHeader className="sr-only">
            <SheetTitle></SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          <NavigationSidebar />
        </div>
        {type === "channel" ? (
          <ServerSidebar serverId={serverId} />
        ) : (
          <ConversationSidebar />
        )}
      </SheetContent>
    </Sheet>
  );
};
