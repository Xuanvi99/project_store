import useChatContext from "../context/useChatContext";
import ConversationsList from "./list";
import ConversationSearch from "./search";

function AllConversations() {
  const { openSearchResult } = useChatContext();
  return (
    <aside className="flex w-full h-full overflow-hidden bg-white rounded-lg basis-1/3">
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

export default AllConversations;
