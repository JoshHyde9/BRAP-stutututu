"use client";

import type z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { api } from "@workspace/api";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@workspace/ui/components/form";

import { useChatSocket } from "@/hooks/use-chat-socket";
import { useModal } from "@/hooks/use-modal-store";
import { messageFileSchema } from "@/lib/schema";

import { FileUpload } from "@/components/file-upload";

export const MessageFileModal = () => {
  const { mutate: sendMessage, isPending } = useChatSocket();
  const { isOpen, onClose, type, props } = useModal();

  const form = useForm({
    resolver: zodResolver(messageFileSchema),
    defaultValues: {
      fileUrl: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof messageFileSchema>) => {
    const parsedData = await messageFileSchema.parseAsync(values);
    sendMessage(
      {
        channelId: props.query!.channelId,
        serverId: props.query!.serverId,
        content: parsedData.fileUrl,
        fileUrl: parsedData.fileUrl,
      },
      {
        onSuccess: () => {
          handleModalClose();
        },
      },
    );
  };

  const isModalOpen = isOpen && type === "messageFile";

  const handleModalClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black dark:bg-[#2b2d31]">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="dark:text-primary text-center text-2xl font-bold">
            Send an Attachment
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="messageFile"
                          value={field.value!}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4 dark:bg-[#1E1F22]">
              <Button disabled={isPending}>Send</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
