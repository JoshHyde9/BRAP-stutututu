"use client";

import { Settings } from "lucide-react";

import { ActionTooltip } from "@/components/action-tooltip";

export const UserSettings = () => {
  // TODO: Opens modal so user can logout, edit display name etc...
  return (
    <ActionTooltip label="User Settings" side="top" align="center">
      <button className="p-1 rounded-sm hover:bg-current/10">
        <Settings className="stroke-[1.5]  hover:cursor-pointer hover:animate-spin-brief dark:stroke-neutral-400" />
      </button>
    </ActionTooltip>
  );
};
