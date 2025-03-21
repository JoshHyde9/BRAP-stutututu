import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { api } from "@workspace/api";
import { Separator } from "@workspace/ui/components/separator";

import { getServerSession } from "@/lib/get-server-session";

import { DirectMessages } from "@/components/navigation/direct-messages";
import { ServerList } from "@/components/navigation/server-list";
import { ThemeToggle } from "@/components/theme-toggle";

export const NavigationSidebar = async () => {
  const session = await getServerSession();

  if (!session) {
    return redirect("/");
  }

  const { data: servers } = await api.server.all.get({
    fetch: { headers: await headers() },
  });

  return (
    <div className="text-primary flex h-full w-full flex-col items-center space-y-4 bg-zinc-200 py-3 dark:bg-[#1e1f22]">
      <DirectMessages />
      <Separator className="mx-auto h-[2px] !w-10 rounded-md bg-zinc-300 dark:bg-zinc-700" />

      <ServerList servers={servers} />
      <div className="mt-auto flex flex-col items-center gap-y-4 pb-3">
        <ThemeToggle />
      </div>
    </div>
  );
};
