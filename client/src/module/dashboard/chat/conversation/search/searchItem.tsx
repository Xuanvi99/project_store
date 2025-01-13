import { IUser } from "@/types/user.type";
import { cn } from "@/utils";
import useChatContext from "../../context/useChatContext";
import { useLazyGetOneConversationQuery } from "@/stores/service/chat.service";
import { setSelectedConversation } from "@/stores/reducer/chat.reducer";
import { useAppDispatch } from "@/hook";

type TProps = {
  user: IUser;
};
function SearchItem({ user }: TProps) {
  const {
    handleOpenSearchResult,
    handleSetCheckConversation,
    handleSelectReceiverId,
  } = useChatContext();

  const dispatch = useAppDispatch();

  const [getOneConversation] = useLazyGetOneConversationQuery();

  const handleGetConversationByUser = async () => {
    await getOneConversation(user._id)
      .unwrap()
      .then((res) => {
        dispatch(setSelectedConversation(res));
        handleSetCheckConversation(res ? true : false);
        if (!res) {
          handleSelectReceiverId(user._id);
        }
      });
  };

  return (
    <div
      className={cn(
        "flex items-center space-x-2 max-h-[60px] transition-all p-3 cursor-pointer hover:bg-grayE5 rounded-lg"
      )}
      onClick={() => {
        handleOpenSearchResult(false);
        handleGetConversationByUser();
      }}
    >
      <div className="relative w-10 h-10 rounded-full">
        <img
          alt=""
          srcSet={user.avatar?.url || user?.avatarDefault}
          className="max-w-full rounded-full"
        />
        {user.status === "online" && (
          <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green66"></div>
        )}
      </div>
      <div className="text-xs">
        <span className="font-semibold">{user?.userName}</span>
      </div>
    </div>
  );
}

export default SearchItem;
