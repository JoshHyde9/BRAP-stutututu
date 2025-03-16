import { useForm } from "react-hook-form";

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
  queryParams: Record<QueryParamsKeys, string>;
  messageId: string;
};

export const EditMessage: React.FC<EditMessageProps> = ({ queryParams, messageId }) => {
  const { editMessage } = useChatSocket();

  const form = useForm({
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (values: {content: string}) => {
    editMessage.mutate(
      {
        channelId: queryParams.channelId,
        serverId: queryParams.serverId,
        content: values.content,
        messageId: messageId
      },
      {
        onSuccess: () => {
          form.reset();
        },
      },
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative flex items-center p-4 pb-6">
                  <Input
                    disabled={editMessage.isPending}
                    autoComplete="off"
                    className="border-none bg-zinc-200/90 px-14 py-6 text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700/75 dark:text-zinc-200"
                    {...field}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
