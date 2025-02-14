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
    <div className="flex flex-col basis-[70%] h-full bg-white rounded-md overflow-hidden">
      <HeaderView />
      <div className="h-[calc(100%-50px)]">
        <ChatContainer />
      </div>
    </div>
  );
}

export default ChatViewMessage;
