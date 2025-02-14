import { useAppDispatch, useSelectorChatSlice } from "@/hook";
import { setChat } from "@/stores/reducer/chat.reducer";
import {
  useGetOneMessagesQuery,
  useSeenMessagesMutation,
} from "@/stores/service/chat.service";

import { IConversation, IMessage } from "@/types/chat.type";
import { IUser } from "@/types/user.type";
import { cn, momentVi } from "@/utils";
import { useEffect, useLayoutEffect, useState } from "react";
import SkeletonConversationItem from "../../skeleton/SkeletonConversationItem";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useGetProfileQuery } from "@/stores/service/user.service";

type TProps = {
  conversation: IConversation<IUser>;
  currentUserId: string;
};
function ConversationItem({ conversation, currentUserId }: TProps) {
  const { messageLasterId } = conversation;

  const { onlineUsers, selectedConversation } = useSelectorChatSlice();

  const dispatch = useAppDispatch();

  const {
    data: dataMessage,
    status: statusGetMessage,
    refetch,
  } = useGetOneMessagesQuery(messageLasterId);

  const [seenMessages] = useSeenMessagesMutation();

  const [receiverInfo, setReceiverInfo] = useState<IUser>();

  const [receiverId, setReceiverId] = useState<string>("");

  const [message, setMessage] = useState<IMessage<IUser>>();

  const [timeSender, setTimeSender] = useState<string>("");

  const { data: dataGetProfile, status: statusGetProfile } = useGetProfileQuery(
    receiverId,
    { skip: !receiverId }
  );

  const handleSelectConversation = async () => {
    try {
      if (conversation && receiverInfo) {
        dispatch(
          setChat({
            selectedConversation: conversation,
            receiverId: receiverInfo._id,
            receiverInfo: receiverInfo,
            totalMessage: conversation.totalMessage,
          })
        );
      }
      await seenMessages({
        conversationId: conversation._id,
        userId: currentUserId,
      })
        .unwrap()
        .then(() => {
          refetch();
        })
        .catch(() => {
          throw new Error("Failed to fetch");
        });
    } catch (error) {
      console.log("error: ", error);
    }
  };

  useLayoutEffect(() => {
    if (conversation) {
      const receiver = conversation.participants.find(
        (r) => r._id !== currentUserId
      );
      if (receiver) setReceiverId(receiver._id);
    }
  }, [conversation, currentUserId]);

  useLayoutEffect(() => {
    if (dataMessage && statusGetMessage === "fulfilled") {
      setMessage(dataMessage);
    }
  }, [dataMessage, statusGetMessage]);

  useLayoutEffect(() => {
    if (dataGetProfile && statusGetProfile === "fulfilled") {
      setReceiverInfo(dataGetProfile.user);
      const id = dataGetProfile.user._id;

      if (selectedConversation) {
        const result = selectedConversation.participants.findIndex(
          (r) => r._id === id
        );
        if (result > -1) {
          dispatch(
            setChat({
              receiverInfo: dataGetProfile.user,
            })
          );
        }
      }
    }
  }, [dataGetProfile, dispatch, selectedConversation, statusGetProfile]);

  useEffect(() => {
    let timeRefetch = undefined;
    if (message) {
      timeRefetch = setInterval(() => {
        setTimeSender(momentVi(message.createdAt).fromNow(true));
      }, 60000);
    }
    return () => clearInterval(timeRefetch);
  }, [message]);

  if (!message) return <SkeletonConversationItem />;

  return (
    <div
      className={cn(
        "flex items-center space-x-2 max-h-[68] transition-all p-[10px] cursor-pointer hover:bg-grayE5 rounded-lg",
        selectedConversation?._id === conversation._id && "bg-grayF0"
      )}
      onClick={handleSelectConversation}
    >
      <div className="relative w-12 h-12 max-w-12">
        <div className="w-12 h-12 overflow-hidden rounded-full ">
          <LazyLoadImage
            alt="image"
            placeholderSrc={"/public/userName.png"}
            srcSet={receiverInfo?.avatar?.url || receiverInfo?.avatarDefault}
            effect="blur"
            className="object-cover max-w-full "
            height={48}
            width={48}
            threshold={100}
          />
        </div>
        {onlineUsers.includes(receiverId) && (
          <div className="absolute bottom-0 right-0 w-4 h-4 border-2 border-white rounded-full bg-green66"></div>
        )}
      </div>
      <div className="flex justify-start w-[calc(100%-50px)] h-12">
        <div className="flex flex-col w-full">
          <div className="font-semibold ">{receiverInfo?.userName}</div>
          <div className="flex justify-start text-xs gap-x-1 text-secondary ">
            <span className="max-w-[70%] flex gap-x-[2px]">
              <span className="font-semibold">
                {message?.senderId._id !== receiverId && "Bạn: "}
              </span>
              <span
                className={cn(
                  "line-clamp-1",
                  message?.senderId._id === receiverId &&
                    !message?.receiverSeen &&
                    "font-semibold text-black"
                )}
              >
                {message?.text}
              </span>
            </span>
            <span className="basis-[30%]">
              -{" "}
              {timeSender
                ? timeSender
                : momentVi(message?.createdAt).fromNow(true)}
            </span>
          </div>
        </div>
        {message &&
          message.senderId._id === receiverId &&
          !message.receiverSeen && (
            <div className="flex items-center w-[10px] h-full">
              <span className="w-[10px] h-[10px] rounded-full bg-orange"></span>
            </div>
          )}
      </div>
    </div>
  );
}

export default ConversationItem;
