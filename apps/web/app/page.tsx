import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { api } from "@workspace/api";

import { Epic } from "@/components/epic";

import { Session } from "@/components/get-session";
import { getServerSession } from "@/lib/get-server-session";

export default async function Page() {
  const queryClient = new QueryClient();
  const session = await getServerSession();

  await queryClient.prefetchQuery({
    queryKey: ["epic"],
    queryFn: async () => (await api.hello.index.get()).data,
  });


  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello World</h1>

        <Session />

        <HydrationBoundary state={dehydrate(queryClient)}>
          <Epic />
        </HydrationBoundary>
      </div>
    </div>
  );
}
