"use client";

import { useState } from "react";
import { ChevronLeft, Copy, CornerUpLeft, Pencil, Trash } from "lucide-react";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@workspace/ui/components/drawer";
import { Separator } from "@workspace/ui/components/separator";
import { useLongPress } from "@workspace/ui/hooks/use-long-press";

type MessageToolbarDrawerProps = {
  children: React.ReactNode;
};

/* TODO:
 * Add functionality to actions
 * Conditional rendering
 * Separate out lists into own components
 */
export const MessageToolbarDrawer: React.FC<MessageToolbarDrawerProps> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [onStart, onEnd] = useLongPress(() => setOpen(true), 800);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <div onTouchStart={onStart} onTouchEnd={onEnd}>
        {children}
      </div>
      <DrawerContent className="dark:bg-accent border-none bg-[#f2f3f5] text-black dark:text-neutral-200">
        <DrawerHeader className="sr-only text-left">
          <DrawerTitle>Message Actions</DrawerTitle>
          <DrawerDescription>Message Actions</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-y-2 px-2">
          <div className="flex flex-col rounded-md">
            <ul className="my-2 flex list-none flex-col rounded-md bg-white dark:bg-[#2b2d31]">
              <li className="inline-flex items-center gap-x-2 p-3">
                <ChevronLeft className="size-4" />
                Add Reaction
              </li>
              <Separator className="dark:bg-muted-foreground/20" />
              <li className="inline-flex items-center gap-x-2 p-3">
                <Pencil className="size-4" />
                Edit Message
              </li>
              <Separator className="dark:bg-muted-foreground/20" />
              <li className="inline-flex items-center gap-x-2 p-3">
                <CornerUpLeft className="size-4" />
                Reply
              </li>
            </ul>
            <ul className="my-2 flex list-none flex-col rounded-md bg-white dark:bg-[#2b2d31]">
              <li className="inline-flex items-center gap-x-2 p-3">
                <Copy className="size-4" />
                Copy Text
              </li>
              <Separator className="dark:bg-muted-foreground/20" />
              <li className="inline-flex items-center gap-x-2 p-3">
                <span className="bg-muted-foreground rounded-xs inline-flex size-4 items-center justify-center text-xs font-bold text-white dark:text-black">
                  ID
                </span>
                Copy Message ID
              </li>
            </ul>
            <ul className="my-2 flex list-none flex-col rounded-md bg-white dark:bg-[#2b2d31]">
              <li className="inline-flex items-center gap-x-2 p-3 text-rose-500">
                <Trash className="size-4" />
                Delete Message
              </li>
            </ul>
          </div>
        </div>
        <DrawerFooter />
      </DrawerContent>
    </Drawer>
  );
};
