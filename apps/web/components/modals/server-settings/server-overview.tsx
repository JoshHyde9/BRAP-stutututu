import type { Server } from "@workspace/db";
import type z from "zod";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { api } from "@workspace/api";
import { Button } from "@workspace/ui/components/button";
import { DialogFooter } from "@workspace/ui/components/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";

import { createNewServerSchema } from "@/lib/schema";

import { FileUpload } from "@/components/file-upload";

type ServerOverviewProps = {
  server?: Server;
};

export const ServerOverview: React.FC<ServerOverviewProps> = ({ server }) => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(createNewServerSchema),
    defaultValues: {
      name: server!.name,
      imageUrl: server!.imageUrl,
    },
  });

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
      router.refresh();
    },
  });

  const onSubmit = async (values: z.infer<typeof createNewServerSchema>) => {
    const parsedData = await createNewServerSchema.parseAsync(values);
    mutate(parsedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
  );
};
