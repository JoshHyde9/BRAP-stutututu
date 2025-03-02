import { getServerSession } from "@/lib/get-server-session";
import { redirect } from "next/navigation";

const SetupPage = async () => {
  const session = await getServerSession();

  if (!session) {
    return redirect("/login");
  }

  return (
    <div>
      <h1>Weclome {session.user.name}</h1>
    </div>
  );
};

export default SetupPage;
