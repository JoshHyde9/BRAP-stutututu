"use client";

import type z from "zod";

import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { useModal } from "@/hooks/use-modal-store";
import { createNewChannelSchema } from "@/lib/schema";
import { api } from "@workspace/api";
import { ChannelType } from "@workspace/db";
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
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { useEffect } from "react";

export const CreateChannelModal = () => {
  const { isOpen, onClose, type, props } = useModal();
  const router = useRouter();

  console.log({channelType: props.channelType})

  const form = useForm({
    resolver: zodResolver(createNewChannelSchema),
    defaultValues: {
      name: "",
      type: props.channelType ?? ChannelType.TEXT,
    },
  });
  
  const createChannel = async (
    values: z.infer<typeof createNewChannelSchema>,
  ) => {
    const { data, error } = await api.channel.create({ serverId: props.server!.id }).post(values);

    if (error) throw error;

    return data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: createChannel,
    onError: (err) => {
      console.log(err);
    },
    onSuccess: (server) => {
      form.reset();
      router.push(`/server/${server.id}`);
      router.refresh();
      onClose();
    },
  });

  useEffect(() => {
    console.log(props.channelType)
    if (props.channelType) {
      form.setValue("type", props.channelType)
    }
  }, [])

  const onSubmit = async (values: z.infer<typeof createNewChannelSchema>) => {
    const parsedData = await createNewChannelSchema.parseAsync(values);
    mutate(parsedData);
  };

  const isModalOpen = isOpen && type === "createChannel";

  const handleModalClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black dark:bg-[#2b2d31]">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="dark:text-primary text-center text-2xl font-bold">
            Create a channel
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-primary/70 text-xs font-bold uppercase text-zinc-500">
                      Channel Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        className="dark:text-primary/80 border-0 bg-zinc-300/50 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-800"
                        placeholder="Channel name..."
                        onChange={(event) => {
                          field.onChange(
                            // @ts-ignore gross TS error I cba to deal with
                            event.currentTarget.value
                              .replace(/\s+/g, "-")
                              .toLowerCase(),
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-primary/70 text-xs font-bold uppercase text-zinc-500">
                      Channel Type
                    </FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      defaultValue={props.channelType ?? field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="dark:text-primary/80 w-full border-0 bg-zinc-300/50 capitalize focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-800">
                          <SelectValue placeholder="Select a channel type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ChannelType).map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                            className="cursor-pointer capitalize"
                          >
                            {type.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4 dark:bg-[#1E1F22]">
              <Button disabled={isPending}>Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
