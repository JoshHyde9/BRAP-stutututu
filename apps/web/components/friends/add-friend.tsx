"use client";

import type z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { api } from "@workspace/api";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";

import { friendRequestSchema } from "@/lib/schema";

export const AddFriend = () => {
  const form = useForm({
    resolver: zodResolver(friendRequestSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSendFriendRequest = async (
    values: z.infer<typeof friendRequestSchema>,
  ) => {
    const { data, error } = await api.friend.sendRequest.post(values);

    if (error) throw error;

    return data;
  };

  const { mutate: sendFriendRequest, isPending } = useMutation({
    mutationFn: onSendFriendRequest,
    onSuccess: () => {
      toast("Friend request sent", { position: "top-center" });
      form.reset();
    },
    onError: () => {
      toast.error("User does not exist", { position: "top-center" });
    },
  });

  const onSubmit = (values: z.infer<typeof friendRequestSchema>) => {
    sendFriendRequest(values);
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
                  Add friend
                </FormLabel>
                <FormDescription>
                  You can add friends with their usernames
                </FormDescription>
                <FormControl>
                  <div className="dark:text-primary/80 relative flex w-full items-center rounded-md border-0 bg-zinc-300/50 p-2 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-800">
                    <div className="mr-4 flex-auto">
                      <Input
                        disabled={isPending}
                        className="border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="You can add friends with their usernames"
                        autoComplete="off"
                        {...field}
                      />
                    </div>
                    <Button
                      disabled={field.value === ""}
                      type="submit"
                      className="disabled:pointer-events-auto disabled:cursor-not-allowed"
                      size="sm"
                    >
                      Send Friend Request
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};
