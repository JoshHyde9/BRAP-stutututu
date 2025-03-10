"use client";

import type { SectionType } from "@/lib/types";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Command, Search } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command";

type ServerSearchProps = {
  data: {
    label: string;
    type: SectionType;
    data: {
      id: string;
      icon: React.ReactNode;
      name: string;
    }[];
  }[];
};

type OnClickProps = {
  id: string;
  type: SectionType;
};

type ParamsProps = {
  serverId: string;
};

export const ServerSearch: React.FC<ServerSearchProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams<ParamsProps>();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const onClick = ({ id, type }: OnClickProps) => {
    setOpen(false);

    // TODO: Create ability for users to DM each other
    if (type === "member") {
      return router.push(`/server/${params?.serverId}/conversation/${id}`);
    }

    // TODO: Create individual channel page
    if (type === "channel") {
      return router.push(`/server/${params?.serverId}/channel/${id}`);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="darkhover:bg-zinc-700/50 group flex w-full items-center gap-x-2 rounded-md p-2 transition hover:bg-zinc-700/10"
      >
        <Search className="size-4 text-zinc-400 dark:text-zinc-400" />
        <p className="text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300">
          Search
        </p>
        <kbd className="bg-muted text-muted-foreground pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium">
          <span className="text-xs">
            <Command className="size-3" />
          </span>
          K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {data.map(({ data, type, label }) => {
            if (!data.length) return null;

            return (
              <CommandGroup key={label} heading={label}>
                {data.map(({ icon, id, name }) => (
                  <CommandItem key={id} onSelect={() => onClick({ id, type })}>
                    {icon}
                    <span>{name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
};
