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

export const LeaveServerModal = () => {
  const { isOpen, onClose, type, props } = useModal();
  const router = useRouter();
  const { server } = props;

  const isModalOpen = isOpen && type === "leaveServer";

  const onLeaveServer = async () => {
    const { data, error } = await api.server
      .leave({ serverId: server?.id })
      .patch();

    if (error) throw error;

    return data;
  };

  const { mutate: leaveServer, isPending } = useMutation({
    mutationFn: onLeaveServer,
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
            Leave Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you are sure you want to leave{" "}
            <span className="font-semibold text-indigo-500">
              {server?.name}
            </span>
            ?
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
              onClick={() => leaveServer()}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
