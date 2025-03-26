import { getServerSession } from "@/lib/get-server-session";
import { redirect } from "next/navigation";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {

  const session = await getServerSession();

  if (session) {
    return redirect("/");
  }

    return (
      <div className="flex h-full items-center justify-center">{children}</div>
    );
  };
