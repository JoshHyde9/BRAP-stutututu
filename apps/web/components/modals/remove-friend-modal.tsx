"use client";

import type z from "zod";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { api } from "@workspace/api";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { removeFriendSchema } from "@/lib/schema";

export const RemoveFriendModal = () => {
  const { isOpen, onClose, type, props } = useModal();
  const router = useRouter();
  const { friendshipId, username } = props;

  const isModalOpen = isOpen && type === "removeFriend";

  const onRemoveFriend = async (values: z.infer<typeof removeFriendSchema>) => {
    const { data, error } = await api.friend.remove.delete(values);

    if (error) throw error;

    return data;
  };

  const { mutate: removeFriend, isPending } = useMutation({
    mutationFn: onRemoveFriend,
    onSuccess: () => {
      onClose();

      router.refresh();
    },
  });

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black dark:bg-[#2b2d31]">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="dark:text-primary text-center text-2xl font-bold">
            Remove Friend
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you are sure you want to remove{" "}
            <span className="font-semibold text-indigo-500">{username}</span>
            {" "} as a friend?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4 dark:bg-[#1E1F22]">
          <div className="flex w-full items-center justify-between">
            <Button onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={() => removeFriend({ friendshipId })}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
