"use client";

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

export const DeleteChannelModal = () => {
  const { isOpen, onClose, type, props } = useModal();
  const router = useRouter();
  const { channel, server } = props;

  const isModalOpen = isOpen && type === "deleteChannel";

  const onDeleteChannel = async () => {
    const { data, error } = await api.channel
      .deleteChannel({ serverId: server?.id })({ channelId: channel?.id })
      .delete();

    if (error) throw error;

    return data;
  };

  const { mutate: deleteChannel, isPending } = useMutation({
    mutationFn: onDeleteChannel,
    onSuccess: (success) => {
      if (success) {
        onClose();
        
        router.refresh();
      }
    },
  });

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black dark:bg-[#2b2d31]">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="dark:text-primary text-center text-2xl font-bold">
            Delete Channel
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you are sure you want to delete{" "}
            <span className="font-semibold text-indigo-500">
              {channel?.name}
            </span>
            ? This cannot be undone and will be permanently deleted.
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
              onClick={() => deleteChannel()}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
