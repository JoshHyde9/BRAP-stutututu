"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { useModal } from "@/hooks/use-modal-store";
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

export const DeleteServerModal = () => {
  const { isOpen, onClose, type, props } = useModal();
  const router = useRouter();
  const { server } = props;

  const isModalOpen = isOpen && type === "deleteServer";

  const onDeleteServer = async () => {
    const { data, error } = await api.server
      .deleteServer({ serverId: server!.id })
      .delete();

    if (error) throw error;

    return data;
  };

  const { mutate: deleteServer, isPending } = useMutation({
    mutationFn: onDeleteServer,
    onSuccess: () => {
      onClose();

      router.refresh();
      router.push("/");
    },
  });

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black dark:bg-[#2b2d31]">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="dark:text-primary text-center text-2xl font-bold">
            Delete Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you are sure you want to delete{" "}
            <span className="font-semibold text-indigo-500">
              {server?.name}
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
              onClick={() => deleteServer()}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
