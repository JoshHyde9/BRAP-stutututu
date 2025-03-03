"use client";
import type z from "zod";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { api } from "@workspace/api";

import { createNewServerSchema } from "@/lib/schema";

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
  FormMessage,
  FormItem,
  FormLabel,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";

import { FileUpload } from "@/components/file-upload";

export const InitialModal = () => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(createNewServerSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const createServer = async (
    values: z.infer<typeof createNewServerSchema>
  ) => {
    const { data, error } = await api.server.create.post(values);

    if (error) throw error;

    return data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: createServer,
    onError: (err) => {
      console.log(err);
    },
    onSuccess: (server) => {
      form.reset();
      router.push(`/server/${server.id}`);
    },
  });

  const onSubmit = async (values: z.infer<typeof createNewServerSchema>) => {
    const parsedData = await createNewServerSchema.parseAsync(values);
    mutate(parsedData);
  };

  if (!isMounted) return null;

  return (
    <Dialog open>
      <DialogContent className="overflow-hidden bg-white p-0 text-black dark:bg-[#2b2d31]">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold dark:text-primary">
            Customise Your Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your server some personality with a name and image. You can
            always change this later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-primary/70">
                      Server Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        className="border-0 bg-zinc-300/50 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-800 dark:text-primary/80"
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
              <Button disabled={isPending}>Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
