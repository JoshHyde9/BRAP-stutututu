"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
  FormItem,
  FormLabel,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";

type EditServerProfileSchema = {
  nickname: string;
};

export const EditServerProfileModal = () => {
  const { isOpen, onClose, type, props } = useModal();
  const router = useRouter();
  const { server } = props;

  const form = useForm<EditServerProfileSchema>({
    defaultValues: {
      nickname: "",
    },
  });

  const loggedInUserServerMember = server?.members.filter(
    (member) => member.userId === props.userId
  )[0];

  useEffect(() => {
    if (server && loggedInUserServerMember) {
      form.setValue(
        "nickname",
        loggedInUserServerMember.nickname ??
          loggedInUserServerMember.user.displayName ??
          loggedInUserServerMember.user.name
      );
    }
  }, [props]);


  const editServerProfile = async (values: EditServerProfileSchema) => {
    const { data, error } = await api.member
      .editMember({
        serverId: server!.id,
      })({ memberId: loggedInUserServerMember!.id })
      .patch(values);

    if (error) throw error;

    return data;
  };

  const { mutate: mutateEditServerProfile, isPending } = useMutation({
    mutationFn: editServerProfile,
    onSuccess: () => {
      router.refresh();
      handleModalClose();
    },
    onError: (error) => {
      console.log(error);
    }
  });

  const onSubmit = async (values: EditServerProfileSchema) => {
    mutateEditServerProfile(values);
  };

  const isModalOpen = isOpen && type === "editServerProfile";

  const handleModalClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black dark:bg-[#2b2d31]">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold dark:text-primary">
            Edit Server Profile
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Customise your preferences and profile details.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="nickname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-primary/70">
                      Nickname
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
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4 dark:bg-[#1E1F22]">
              <Button disabled={isPending}>Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
