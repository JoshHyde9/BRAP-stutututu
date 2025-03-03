import { redirect } from "next/navigation";

import { getServerSession } from "@/lib/get-server-session";

import { SignOut } from "@/components/sign-out";

const SetupPage = async () => {
  const session = await getServerSession();

  if (!session) {
    return redirect("/login");
  }

  return (
    <div className="container mx-auto max-w-prose flex flex-col space-y-5">
      <h1 className="text-5xl font-bold">Weclome {session.user.name}</h1>


      <SignOut />
    </div>
  );
};

export default SetupPage;
