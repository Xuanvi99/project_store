import ChatAllConversations from "./conversation";
import ChatViewMessage from "./viewMessage";

function ChatDb() {
  return (
    <div className="Dashboard_chat w-full h-[calc(100vh-60px)] bg-grayCa flex p-3 gap-x-3 ">
      <ChatAllConversations />
      <ChatViewMessage />
    </div>
  );
}

export default ChatDb;
