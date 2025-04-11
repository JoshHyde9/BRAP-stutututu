import { headers } from "next/headers";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { api } from "@workspace/api";

import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["servers"],
    queryFn: async () => {
      const { data: servers } = await api.server.all.get({
        fetch: { headers: await headers() },
      });

      return servers;
    },
  });

  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-30 hidden h-full w-[72px] flex-col md:flex">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <NavigationSidebar />
        </HydrationBoundary>
      </div>
      <main className="h-full md:pl-[72px]">{children}</main>
    </div>
  );
};

export default MainLayout;
