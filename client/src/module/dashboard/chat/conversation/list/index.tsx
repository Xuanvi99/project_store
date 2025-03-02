import { cn } from "@/utils";
import ConversationItem from "./ConversationItem";
import { useSelectorAuthSlice } from "@/hook";
import { IConversation } from "@/types/chat.type";
import { IUser } from "@/types/user.type";

type TPropsConversationList = {
  conversations: IConversation<IUser>[] | undefined;
  openSearchResult: boolean;
};
function ConversationsList({
  conversations,
  openSearchResult,
}: TPropsConversationList) {
  const { user } = useSelectorAuthSlice();

  return (
    <div
      className={cn(
        "w-full h-full flex flex-col mt-auto overflow-auto",
        openSearchResult && "hidden"
      )}
    >
      {user &&
        conversations &&
        conversations.length > 0 &&
        conversations.map((data) => {
          return (
            <ConversationItem
              key={data._id}
              conversation={data}
              currentUserId={user._id}
            />
          );
        })}
    </div>
  );
}

export default ConversationsList;
