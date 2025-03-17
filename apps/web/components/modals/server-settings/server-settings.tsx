"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { cn } from "@workspace/ui/lib/utils";

import { useModal } from "@/hooks/use-modal-store";

import { ServerBans } from "@/components/modals/server-settings/server-bans";
import { ServerOverview } from "@/components/modals/server-settings/server-overview";

export const ServerSettingsModal = () => {
  const { isOpen, onClose, type, props } = useModal();

  const [component, setComponent] = useState<"overview" | "bans">("overview");

  const { server } = props;

  const isModalOpen = isOpen && type === "serverSettings";

  const handleModalClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
      <DialogContent className="min-w-3xl overflow-hidden bg-white p-0 text-black dark:bg-[#2b2d31]">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="dark:text-primary text-center text-2xl font-bold">
            Server Settings
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {component === "overview" &&
              "Give your server some personality with a name and image. You can always change this later."}
            {component === "bans" && "View and search banned users"}
          </DialogDescription>
        </DialogHeader>
        <div className="flex">
          <div className="min-h-80 w-1/4 border-r-2 px-2">
            <button
              onClick={() => setComponent("overview")}
              className={cn(
                "group mb-1 flex w-full items-center gap-x-2 rounded-md p-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50",
                component === "overview" && "bg-zinc-700/20 dark:bg-zinc-700",
              )}
            >
              <p
                className={cn(
                  "line-clamp-1 text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300",
                  component === "overview" &&
                    "text-primary dark:text-zinc-200 dark:group-hover:text-white",
                )}
              >
                Overview
              </p>
            </button>
            <button
              onClick={() => setComponent("bans")}
              className={cn(
                "group mb-1 flex w-full items-center gap-x-2 rounded-md p-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50",
                component === "bans" && "bg-zinc-700/20 dark:bg-zinc-700",
              )}
            >
              <p
                className={cn(
                  "line-clamp-1 text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300",
                  component === "bans" &&
                    "text-primary dark:text-zinc-200 dark:group-hover:text-white",
                )}
              >
                Bans
              </p>
            </button>
          </div>
          <div className="flex-1">
            {component === "overview" && <ServerOverview server={server} />}
            {component === "bans" && <ServerBans serverId={server?.id} />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
