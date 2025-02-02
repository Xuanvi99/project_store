import { IconCLose, IconMessage } from "@/components/icon";
import { cn } from "@/utils";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import {
  useAppDispatch,
  useSelectorAuthSlice,
  useSelectorChatSlice,
  useToggle,
} from "@/hook";
import { toast } from "react-toastify";
import {
  useLazyGetOneConversationQuery,
  useSeenMessagesMutation,
} from "@/stores/service/chat.service";
import { setSelectedConversation } from "@/stores/reducer/chat.reducer";
import ChatContainer from "@/components/Chat/chatContainer";

function ChatFooter() {
  const { user } = useSelectorAuthSlice();

  const { onlineUsers, selectedConversation } = useSelectorChatSlice();

  const dispatch = useAppDispatch();

  const [getOneConversation] = useLazyGetOneConversationQuery();

  const [seenMessages] = useSeenMessagesMutation();

  const [firstLoad, setFirstLoad] = useState<boolean>(false);

  const { toggle: openChat, handleToggle: handleOpenChat } = useToggle();

  const [receiverId, setReceiverId] = useState<string>("");

  const handleOnclickChat = useCallback(async () => {
    try {
      if (selectedConversation && user) {
        await seenMessages({
          conversationId: selectedConversation._id,
          userId: user._id,
        })
          .unwrap()
          .then(() => {
            handleOpenChat();
            setFirstLoad(true);
          });
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }, [handleOpenChat, seenMessages, selectedConversation, user]);

  useLayoutEffect(() => {
    if (user) {
      const handleGetOneConversation = async () => {
        await getOneConversation(user._id)
          .unwrap()
          .then((res) => {
            dispatch(setSelectedConversation(res));
          })
          .catch(() => {
            toast("Lỗi request data trò chuyện", { type: "error" });
          });
      };
      handleGetOneConversation();
    }
  }, [dispatch, getOneConversation, user]);

  useEffect(() => {
    if (selectedConversation && user) {
      const receiverId = selectedConversation.participants.find(
        (r) => r !== user._id
      );
      setReceiverId(receiverId as string);
    }
  }, [selectedConversation, user]);

  return (
    <div className={cn("fixed right-3 bottom-0 z-40")}>
      <div
        onClick={handleOnclickChat}
        className={cn(
          "absolute right-0 bottom-2 flex justify-center items-center transition-opacity gap-x-2 text-lg font-semibold ",
          "text-orange bg-white rounded-full p-3 border-1 border-orange cursor-pointer hover:text-white hover:bg-orange",
          openChat ? "opacity-0 hidden" : "opacity-100"
        )}
      >
        <span>
          <IconMessage size={30}></IconMessage>
        </span>

        <div
          className={cn(
            "absolute bottom-0 right-0 w-4 h-4 border-2 border-white rounded-full bg-danger",
            onlineUsers.includes(receiverId) && "bg-green66"
          )}
        ></div>
      </div>
      <div
        className={cn(
          "chat absolute right-0 bottom-0 rounded-t-md border-1 border-orange bg-grayE5 ",
          firstLoad
            ? openChat
              ? "w-[450px] h-[500px] opacity-1 "
              : "w-[0px] h-[0px] opacity-0"
            : "hidden"
        )}
      >
        <div className="flex flex-col w-full h-full">
          <div className="flex items-center justify-between p-3 leading-5 max-h-[50px] bg-white rounded-t-md border-b-1 border-b-orange">
            <h1 className="flex items-center text-lg font-semibold text-orangeFe gap-x-2">
              <span className="flex">
                <IconMessage size={30}></IconMessage>
                {onlineUsers.includes(receiverId) && (
                  <div className="w-4 h-4 border-2 border-white rounded-full bg-green66"></div>
                )}
              </span>
              <span>Tin nhắn</span>
            </h1>
            <div
              onClick={handleOpenChat}
              className="cursor-pointer hover:text-orange"
            >
              <IconCLose size={15}></IconCLose>
            </div>
          </div>
          <div className="h-[450px]">{openChat && <ChatContainer />}</div>
        </div>
      </div>
    </div>
  );
}

export default ChatFooter;
