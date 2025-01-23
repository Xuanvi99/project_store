import { ChatProvide } from "./context";
import ChatAllConversations from "./conversation";
import ChatViewMessage from "./viewMessage";

function ChatDb() {
  return (
    <div className="Dashboard_chat w-full h-[calc(100vh-60px)] ">
      <div className="flex w-full h-full p-3 shadow-lg gap-x-3 bg-grayCa">
        <ChatProvide>
          <ChatAllConversations />
          <ChatViewMessage />
        </ChatProvide>
      </div>
    </div>
  );
}

export default ChatDb;
