"use client";

import type z from "zod";

import { redirect } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

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
import { unbanUserSchema } from "@/lib/schema";

export const UnbanUserModal = () => {
  const { isOpen, onClose, type, props } = useModal();
  const queryClient = useQueryClient();

  const { ban, serverId } = props;

  const isModalOpen = isOpen && type === "unbanUser";

  const onUnbanUser = async (values: z.infer<typeof unbanUserSchema>) => {
    const parsedData = await unbanUserSchema.parseAsync(values);
    const { data, error } = await api.server
      .unBan({ serverId: serverId! })
      .patch(parsedData);

    if (error) throw error;

    return data;
  };

  const { mutate: unbanUser } = useMutation({
    mutationFn: onUnbanUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["serverBans"] });
      onClose();
    },
  });

  const handleModalClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black dark:bg-[#2b2d31]">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="dark:text-primary text-center text-2xl font-bold">
            {ban?.user.name}
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            banned on{" "}
            {ban?.createdAt && format(ban.createdAt, "dd/MM/yyyy, HH:mm")}
          </DialogDescription>
        </DialogHeader>
        <div className="dark:text-primary flex flex-col px-4">
          <h3 className="font-semibold uppercase">Reason:</h3>
          <p>{ban?.reason}</p>
        </div>
        <DialogFooter className="bg-gray-100 px-6 py-4 dark:bg-[#1E1F22]">
          <div className="flex w-full items-center justify-between">
            <Button
              variant="destructive"
              onClick={() => unbanUser({ banId: ban!.id })}
            >
              Revoke Ban
            </Button>
            <Button
              type="button"
              className="bg-discord"
              onClick={() => onClose()}
            >
              Done
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
