"use client";

import type { ServerWithMembers } from "@/lib/types";

import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { api } from "@workspace/api";

import { useModal } from "@/hooks/use-modal-store";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Textarea } from "@workspace/ui/components/textarea";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";

type BanMemberSchema = {
  reason: string;
};

export const BanMemberModal = () => {
  const { onOpen, isOpen, onClose, type, props } = useModal();
  const { server } = props as { server: ServerWithMembers };

  const isModalOpen = isOpen && type === "banMember";

  const form = useForm<BanMemberSchema>({
    defaultValues: {
      reason: "",
    },
  });

  const banMember = async (values: BanMemberSchema) => {
    const { data, error } = await api.member
      .ban({ serverId: server.id })({ userId: props.member!.userId })
      .patch(values);

    if (error) throw error;

    return data;
  };

  const { mutate: mutateBanMember, isPending } = useMutation({
    mutationFn: banMember,
    onSuccess: (server) => {
      onOpen("members", { server });
    },
  });

  const onSubmit = (values: BanMemberSchema) => {
    mutateBanMember(values);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black dark:bg-[#2b2d31]">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold dark:text-primary">
            Ban Member
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center text-zinc-500">
          Are you sure you want to ban{" "}
          <span className="font-semibold text-indigo-500">
            {props.member?.nickname ??
              props.member?.user.displayName ??
              props.member?.user.name}
          </span>
          ?
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-primary/70">
                      Nickname
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={isPending}
                        className="border-0 bg-zinc-300/50 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-800 dark:text-primary/80"
                        placeholder="Being a cockhead..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4 dark:bg-[#1E1F22]">
              <Button variant="destructive" disabled={isPending}>
                Confirm
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
