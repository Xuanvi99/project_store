import { useAppDispatch, useSelectorChatSlice } from "@/hook";
import { setSelectedConversation } from "@/stores/reducer/chat.reducer";
import { useLazyGetOneMessagesQuery } from "@/stores/service/chat.service";
import { useLazyGetProfileQuery } from "@/stores/service/user.service";
import { IConversation, IMessage } from "@/types/chat.type";
import { IUser } from "@/types/user.type";
import { cn, momentVi } from "@/utils";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";

type TProps = {
  conversation: IConversation;
  currentUserId: string;
};
function ConversationItem({ conversation, currentUserId }: TProps) {
  const { messageLaster: messageId } = conversation;

  const { onlineUsers, selectedConversation } = useSelectorChatSlice();

  const dispatch = useAppDispatch();

  const [getProfile] = useLazyGetProfileQuery();

  // const { data: DataResMessage, status, refetch } = useGetOneMessagesQuery(id);

  const [getOneMessage] = useLazyGetOneMessagesQuery();

  const [receiver, setReceiver] = useState<IUser>();

  const [message, setMessage] = useState<IMessage>();

  const [timeSender, setTimeSender] = useState<string>("");

  const handleGetReceiver = useCallback(async () => {
    try {
      const receiverId = conversation.participants.find(
        (r) => r !== currentUserId
      );
      if (receiverId && messageId) {
        await Promise.all([
          getProfile(receiverId).unwrap(),
          getOneMessage(messageId).unwrap(),
        ]).then((res) => {
          setReceiver(res[0].user);
          setMessage(res[1]);
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [
    conversation.participants,
    currentUserId,
    getOneMessage,
    getProfile,
    messageId,
  ]);

  const handleSelectConversation = () => {
    dispatch(setSelectedConversation(conversation));
  };

  useEffect(() => {
    handleGetReceiver();
  }, [handleGetReceiver]);

  useLayoutEffect(() => {
    let timeRefetch = undefined;
    if (message) {
      timeRefetch = setInterval(() => {
        setTimeSender(momentVi(message.createdAt).fromNow(true));
      }, 1000);
    }
    return () => clearInterval(timeRefetch);
  }, [message]);

  if (!receiver || !message) return;

  return (
    <div
      className={cn(
        "flex items-center space-x-2 max-h-[68] transition-all p-[10px] cursor-pointer hover:bg-grayE5 rounded-lg",
        selectedConversation?._id === conversation._id && "bg-grayF0"
      )}
      onClick={handleSelectConversation}
    >
      <div className="relative w-12 h-12 rounded-full max-w-12">
        <img
          alt="error"
          srcSet={receiver.avatar?.url || receiver?.avatarDefault}
          className="w-12 rounded-full"
        />
        {onlineUsers.includes(receiver._id) && (
          <div className="absolute bottom-0 right-0 w-4 h-4 border-2 border-white rounded-full bg-green66"></div>
        )}
      </div>
      <div className="flex justify-start w-[calc(100%-50px)] h-12">
        <div className="flex flex-col w-full">
          <div className="font-semibold ">{receiver?.userName}</div>
          <div className="flex justify-start text-xs gap-x-1 text-secondary ">
            <span className="max-w-[70%] flex gap-x-[2px]">
              <span className="font-semibold">
                {message.senderId !== receiver._id && "Bạn: "}
              </span>
              <span
                className={cn(
                  "line-clamp-1",
                  message.senderId === receiver._id &&
                    !message.seen &&
                    "font-semibold text-black"
                )}
              >
                {message.text}
              </span>
            </span>
            <span className="basis-[30%]">
              -{" "}
              {timeSender
                ? timeSender
                : momentVi(message.createdAt).fromNow(true)}
            </span>
          </div>
        </div>
        {message.senderId === receiver._id && !message.seen && (
          <div className="flex items-center w-[10px] h-full">
            <span className="w-[10px] h-[10px] rounded-full bg-orange"></span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConversationItem;
