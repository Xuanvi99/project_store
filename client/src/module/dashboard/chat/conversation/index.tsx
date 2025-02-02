import useChatContext from "../context/useChatContext";
import SkeletonConversation from "../skeleton/SkeletonConversation";
import ConversationsList from "./list";
import ConversationSearch from "./search";

function ChatAllConversations() {
  const { openSearchResult, isLoading } = useChatContext();

  if (isLoading) return <SkeletonConversation />;

  return (
    <aside className="flex basis-[30%] h-full overflow-hidden bg-white rounded-lg ">
      <div className="flex flex-col w-full p-3 gap-y-2">
        <div className="flex items-center gap-x-3">
          <p className="text-xl font-semibold">Danh sách tin nhắn</p>
        </div>
        <ConversationSearch />
        {!openSearchResult && <ConversationsList />}
      </div>
    </aside>
  );
}

export default ChatAllConversations;
