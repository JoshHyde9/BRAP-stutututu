import { getServerSession } from "@/lib/get-server-session";
import { SignIn } from "./sign-in-button";
import { SignOut } from "./sign-out";

export const Session = async () => {
   const session = await getServerSession();

   if (!session?.session) {
    return <SignIn />
   }

  return (
    <div className="flex flex-col space-y-2.5 max-w-prose">
      <h1>Welcome {session.user.name}</h1>
      <code>{JSON.stringify(session, null, 2)}</code>
      <SignOut />
    </div>
  );
};
