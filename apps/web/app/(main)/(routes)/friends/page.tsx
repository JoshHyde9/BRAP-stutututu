import { redirect } from "next/navigation";

const FriendsPage = async () => {
  return redirect("/friends/all");
};

export default FriendsPage;
