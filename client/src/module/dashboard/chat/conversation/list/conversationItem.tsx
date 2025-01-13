import { useAppDispatch, useAppSelector } from "@/hook";
import { RootState } from "@/stores";
import {
  setMessages,
  setSelectedConversation,
} from "@/stores/reducer/chat.reducer";
import { useLazyGetMessagesQuery } from "@/stores/service/chat.service";
import { useLazyGetProfileQuery } from "@/stores/service/user.service";
import { IConversation } from "@/types/chat.type";
import { IUser } from "@/types/user.type";
import { cn } from "@/utils";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

type TProps = {
  conversation: IConversation;
  currentUserId: string;
};
function ConversationItem({ conversation, currentUserId }: TProps) {
  const { onlineUsers, selectedConversation } = useAppSelector(
    (state: RootState) => state.chatSlice
  );

  const dispatch = useAppDispatch();

  const [getProfile] = useLazyGetProfileQuery();
  const [getMessages] = useLazyGetMessagesQuery();

  const [receiver, setReceiver] = useState<IUser>();

  const handleGetReceiver = useCallback(async () => {
    try {
      const receiverId = conversation.participants.find(
        (r) => r !== currentUserId
      );
      if (receiverId) {
        await getProfile(receiverId)
          .unwrap()
          .then((res) => {
            setReceiver(res.user);
          });
      }
    } catch (error) {
      console.log(error);
    }
  }, [conversation.participants, currentUserId, getProfile]);

  const handleSelectConversation = () => {
    dispatch(setSelectedConversation(conversation));
  };

  useEffect(() => {
    handleGetReceiver();
  }, [handleGetReceiver]);

  useEffect(() => {
    if (selectedConversation) {
      const handleGetMessages = async () => {
        await getMessages({
          conversationId: selectedConversation._id,
          activePage: 1,
        })
          .unwrap()
          .then((res) => {
            dispatch(setMessages(res));
          })
          .catch(() => {
            toast("Lỗi request dữ liệu", { type: "error" });
          });
      };
      handleGetMessages();
    }
  }, [dispatch, getMessages, selectedConversation]);

  if (!receiver) return null;

  return (
    <div
      className={cn(
        "flex items-center space-x-2 max-h-[70px] transition-all p-3 cursor-pointer hover:bg-grayE5 rounded-lg",
        selectedConversation?._id === conversation._id && "bg-grayCa"
      )}
      onClick={handleSelectConversation}
    >
      <div className="relative w-[50px] h-[50px] rounded-full">
        <img
          alt=""
          srcSet={receiver.avatar?.url || receiver?.avatarDefault}
          className="max-w-full rounded-full"
        />
        {onlineUsers.includes(receiver._id) && (
          <div className="absolute bottom-0 right-0 w-4 h-4 border-2 border-white rounded-full bg-green66"></div>
        )}
      </div>
      <div className="text-xs">
        <span className="font-semibold">{receiver?.userName}</span>
      </div>
    </div>
  );
}

export default ConversationItem;
