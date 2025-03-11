import HeaderView from "./Header";
import { useAppSelector } from "@/hook";
import { RootState } from "@/stores";
import NoConversation from "./NoConversation";
import ChatContainer from "@/components/Chat/ChatContainer";

function ChatViewMessage() {
  const { selectedConversation } = useAppSelector(
    (state: RootState) => state.chatSlice
  );

  if (!selectedConversation) return <NoConversation />;

  return (
    <div className="flex flex-col h-full bg-white rounded-lg basis-[70%] max-w-[70%]">
      <HeaderView />
      <ChatContainer />
    </div>
  );
}

export default ChatViewMessage;
