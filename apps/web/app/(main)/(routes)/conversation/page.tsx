import { redirect } from "next/navigation";

const ConversationPage = async () => {
  return redirect("/friends/all");
};

export default ConversationPage;
