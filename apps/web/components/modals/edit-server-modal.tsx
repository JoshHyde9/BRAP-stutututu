"use client";

import type z from "zod";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { cn } from "@workspace/ui/lib/utils";

import { useModal } from "@/hooks/use-modal-store";
import { createNewServerSchema } from "@/lib/schema";

import { FileUpload } from "@/components/file-upload";
import { ServerBans } from "@/components/modals/server-settings/server-bans";

export const EditServerModal = () => {
  const { isOpen, onClose, type, props } = useModal();
  const router = useRouter();

  const [component, setComponent] = useState<"overview" | "bans">("overview");

  const { server } = props;

  const form = useForm({
    resolver: zodResolver(createNewServerSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (server) {
      form.setValue("name", server.name);
      form.setValue("imageUrl", server.imageUrl);
    }
  }, [props]);

  const editServer = async (values: z.infer<typeof createNewServerSchema>) => {
    const { data, error } = await api.server
      .editServer({ serverId: server!.id })
      .patch(values);

    if (error) throw error;

    return data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: editServer,
    onError: (err) => {
      console.log(err);
    },
    onSuccess: () => {
      form.reset();
      router.refresh();
      onClose();
    },
  });

  const onSubmit = async (values: z.infer<typeof createNewServerSchema>) => {
    const parsedData = await createNewServerSchema.parseAsync(values);
    mutate(parsedData);
  };

  const isModalOpen = isOpen && type === "editServer";

  const handleModalClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
      <DialogContent className="min-w-3xl overflow-hidden bg-white p-0 text-black dark:bg-[#2b2d31]">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="dark:text-primary text-center text-2xl font-bold">
            Customise Your Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your server some personality with a name and image. You can
            always change this later.
          </DialogDescription>
        </DialogHeader>
        <div className="flex">
          <div className="w-1/4 border-r-2 px-2">
            <button
              onClick={() => setComponent("overview")}
              className={cn(
                "group mb-1 flex w-full items-center gap-x-2 rounded-md p-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50",
                component === "overview" && "bg-zinc-700/20 dark:bg-zinc-700",
              )}
            >
              <p
                className={cn(
                  "line-clamp-1 text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300",
                  component === "overview" &&
                    "text-primary dark:text-zinc-200 dark:group-hover:text-white",
                )}
              >
                Overview
              </p>
            </button>
            <button
              onClick={() => setComponent("bans")}
              className={cn(
                "group mb-1 flex w-full items-center gap-x-2 rounded-md p-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50",
                component === "bans" && "bg-zinc-700/20 dark:bg-zinc-700",
              )}
            >
              <p
                className={cn(
                  "line-clamp-1 text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300",
                  component === "bans" &&
                    "text-primary dark:text-zinc-200 dark:group-hover:text-white",
                )}
              >
                Bans
              </p>
            </button>
          </div>
          <div className="flex-1">
            {component === "overview" && (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <div className="space-y-8 px-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-primary/70 text-xs font-bold uppercase text-zinc-500">
                            Server Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled={isPending}
                              className="dark:text-primary/80 border-0 bg-zinc-300/50 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-800"
                              placeholder="Server name..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center justify-center text-center">
                      <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <FileUpload
                                endpoint="serverImage"
                                value={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <DialogFooter className="bg-gray-100 px-6 py-4 dark:bg-[#1E1F22]">
                    <Button disabled={isPending}>Save</Button>
                  </DialogFooter>
                </form>
              </Form>
            )}
            {component === "bans" && <ServerBans serverId={server?.id} />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
