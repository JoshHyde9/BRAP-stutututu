import { useForm } from "react-hook-form";

import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";

import { useChatSocket } from "@/hooks/use-chat-socket";
import { QueryParamsKeys } from "@/lib/types";

type EditMessageProps = {
  queryParams: QueryParamsKeys;
  messageId: string;
  content: string;
  setIsEditing: (isEditing: boolean) => void;
};

export const EditMessage: React.FC<EditMessageProps> = ({
  queryParams,
  messageId,
  content,
  setIsEditing,
}) => {
  const { editMessage } = useChatSocket();

  const form = useForm({
    defaultValues: {
      content: content,
    },
  });

  const onSubmit = async (values: { content: string }) => {
    editMessage.mutate(
      {
        channelId: queryParams.channelId!,
        serverId: queryParams.serverId!,
        content: values.content,
        messageId: messageId,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full items-center gap-x-2 pt-2"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <div className="relative w-full">
                  <Input
                    {...field}
                    disabled={editMessage.isPending}
                    autoComplete="off"
                    className="border-none bg-zinc-200/90 p-2 text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700/75 dark:text-zinc-200"
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="bg-discord" size="sm">
          Save
        </Button>
      </form>
      <span className="mt-1 text-[10px] text-zinc-500">
        Press escape to cancel, enter to save
      </span>
    </Form>
  );
};
