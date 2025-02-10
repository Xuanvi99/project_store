import { IUser } from "@/types/user.type";
import { cn } from "@/utils";
import useChatContext from "../../context/useChatContext";
import { useLazyGetOneConversationQuery } from "@/stores/service/chat.service";
import { IConversation } from "@/types/chat.type";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/hook";
import { setSelectedConversation } from "@/stores/reducer/chat.reducer";
import { LazyLoadImage } from "react-lazy-load-image-component";

type TProps = {
  user: IUser;
};
function SearchItem({ user }: TProps) {
  const { handleOpenSearchResult } = useChatContext();

  const dispatch = useAppDispatch();

  const [getOneConversation] = useLazyGetOneConversationQuery();

  const [conversation, setConversation] = useState<IConversation | null>(null);

  useEffect(() => {
    const handleGetOneConversation = async () => {
      await getOneConversation(user._id)
        .unwrap()
        .then((res) => {
          setConversation(res);
        })
        .catch(() => {
          toast("Lỗi request data trò chuyện", { type: "error" });
        });
    };
    handleGetOneConversation();
  }, [getOneConversation, user._id]);

  return (
    <div
      className={cn(
        "flex items-center space-x-2 max-h-[60px] transition-all p-3 cursor-pointer hover:bg-grayE5 rounded-lg"
      )}
      onClick={() => {
        handleOpenSearchResult(false);
        dispatch(setSelectedConversation(conversation));
      }}
    >
      <div className="relative w-10 h-10">
        <div className="w-10 h-10 overflow-hidden rounded-full">
          <LazyLoadImage
            alt="image"
            placeholderSrc={"/public/userName.png"}
            srcSet={user.avatar?.url || user?.avatarDefault}
            effect="blur"
            className="object-cover max-w-full "
            height={40}
            width={40}
            threshold={100}
          />
        </div>
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
