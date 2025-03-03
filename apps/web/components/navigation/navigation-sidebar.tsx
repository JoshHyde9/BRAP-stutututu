import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { api } from "@workspace/api";
import { getServerSession } from "@/lib/get-server-session";

import { ThemeToggle } from "@/components/theme-toggle";

import { NavigationAction } from "@/components/navigation/navigation-action";
import { NavigationItem } from "@/components/navigation/navigation-item";

import { Separator } from "@workspace/ui/components/separator";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

export const NavigationSidebar = async () => {
  const session = await getServerSession();

  if (!session) {
    return redirect("/");
  }

  const { data: servers } = await api.server.all.get({
    fetch: { headers: await headers() },
  });

  return (
    <div className="flex h-full w-full flex-col items-center space-y-4 bg-zinc-200 py-3 text-primary dark:bg-[#1e1f22]">
      <NavigationAction />
      <Separator className="mx-auto h-[2px] !w-10 rounded-md bg-zinc-300 dark:bg-zinc-700" />

      <ScrollArea className="flex-1 w-full">
        {servers?.map((server) => (
          <div key={server.id} className="mb-4">
           <NavigationItem id={server.id} imageUrl={server.imageUrl} name={server.name} />
          </div>
        ))}
      </ScrollArea>
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        <ThemeToggle />
      </div>
    </div>
  );
};
