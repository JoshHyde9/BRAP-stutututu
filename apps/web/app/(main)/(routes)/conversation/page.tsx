import { ChatHeader } from "@/components/chat/chat-header";

const FriendsPage = async () => {
  return (
    <div className="flex flex-col bg-white dark:bg-[#313338]">
      <ChatHeader type="friends" />
    </div>
  );
};

export default FriendsPage;
