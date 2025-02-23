import { Button } from "@workspace/ui/components/button";

import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

import { api } from "@workspace/api";
import { Epic } from "@/components/epic";

export default async function Page() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["epic"],
    queryFn: async () => (await api.hello.index.get()).data,
  });

  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello World</h1>
        <Button size="sm">Button</Button>

        <HydrationBoundary state={dehydrate(queryClient)}>
          <Epic />
        </HydrationBoundary>
      </div>
    </div>
  );
}
