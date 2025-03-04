"use client";

import { useState } from "react";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import { api } from "@workspace/api";

import { useOrigin } from "@/hooks/use-origin";
import { useModal } from "@/hooks/use-modal-store";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Button } from "@workspace/ui/components/button";

export const InviteModal = () => {
  const { isOpen, onClose, type, props } = useModal();
  const origin = useOrigin();

  const [copied, setCopied] = useState(false);

  const isModalOpen = isOpen && type === "invite";

  const generateNewInviteCode = async (values: { id: string }) => {
    const { data, error } = await api.server.newInviteCode.post(values);

    if (error) throw error;

    return data;
  };

  const { mutate, isPending, data } = useMutation({
    mutationFn: generateNewInviteCode,
  });

  const inviteURL = `${origin}/invite/${data?.inviteCode ?? props.server?.inviteCode}`;

  const onCopy = async () => {
    await navigator.clipboard.writeText(inviteURL);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const onGenerateNewInviteCode = () => {
    mutate({ id: props.server!.id });
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black dark:bg-[#2b2d31]">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold dark:text-primary">
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-primary/70">
            Server invite link
          </Label>
          <div className="mt-2 flex items-center gap-x-2">
            <Input
              className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-800 dark:text-primary/80"
              value={inviteURL}
              disabled={isPending}
              readOnly
            />
            <Button size="icon" onClick={onCopy} disabled={isPending}>
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <Button
            variant="link"
            onClick={onGenerateNewInviteCode}
            className="mt-4 text-xs text-zinc-500 dark:text-primary/70"
            disabled={isPending}
          >
            Generate a new link
            <RefreshCw className="ml-1 size-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
