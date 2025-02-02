import { IMessage } from "@/types/chat.type";
import Message from "./Message";
import { LoadingCallApi } from "../loading";
import { cn } from "@/utils";
import { useSelectorAuthSlice, useSelectorChatSlice } from "@/hook";
import { forwardRef, useCallback, useEffect, useState } from "react";
import { IUser } from "@/types/user.type";
import { useLazyGetProfileQuery } from "@/stores/service/user.service";
import ChatInfoReceiver from "./chatInfoReceiver";

type TProps = {
  messages: IMessage[];
  isFetchingData: boolean;
  displayTyping: boolean;
  receiverJoinCvs: boolean;
};

const ChatMessages = forwardRef<HTMLDivElement, TProps>(
  (props, containerRef) => {
    const { user } = useSelectorAuthSlice();

    const { selectedConversation } = useSelectorChatSlice();

    const { messages, isFetchingData, displayTyping, receiverJoinCvs } = props;

    const [getProfile] = useLazyGetProfileQuery();

    const [receiver, setReceiver] = useState<IUser>();

    const LoadingDataMessageOld = () => {
      return (
        selectedConversation &&
        messages.length > 0 &&
        messages.length < selectedConversation.totalMessage &&
        isFetchingData && (
          <div className={cn("w-full max-h-16 flex justify-center")}>
            <div className="w-10 h-10">
              <LoadingCallApi />
            </div>
          </div>
        )
      );
    };

    const FetchingDataMessagesFirst = () => {
      return (
        messages.length === 0 &&
        isFetchingData && (
          <div className={cn("m-auto")}>
            <div className="w-10 h-10">
              <LoadingCallApi />
            </div>
          </div>
        )
      );
    };

    const DisplayTyping = () => {
      if (receiver && displayTyping) {
        return (
          <div className="flex items-center justify-start w-full mt-1 message gap-x-2">
            <div className={cn("flex flex-col justify-center h-full")}>
              <span className="overflow-hidden rounded-full w-7 h-7">
                <img
                  alt="error"
                  srcSet={receiver?.avatar?.url || receiver?.avatarDefault}
                  className="object-cover"
                />
              </span>
            </div>
            <div
              className={cn(
                "typing-chat relative max-w-[70%] bg-grayE5 rounded-lg flex justify-center items-center gap-x-1 px-2 py-3"
              )}
            >
              <span className="typing__item"></span>
              <span className="typing__item"></span>
              <span className="typing__item"></span>
            </div>
          </div>
        );
      }
      return null;
    };

    const handleGetReceiver = useCallback(async () => {
      try {
        if (!selectedConversation || !user) return;
        const receiverId = selectedConversation.participants.find(
          (r) => r !== user._id
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
    }, [getProfile, selectedConversation, user]);

    useEffect(() => {
      handleGetReceiver();
    }, [handleGetReceiver]);

    return (
      <div
        ref={containerRef}
        className="flex flex-col h-full px-3 pt-3 overflow-y-scroll bg-white message_list "
      >
        <LoadingDataMessageOld />

        <FetchingDataMessagesFirst />

        {messages.length === selectedConversation?.totalMessage && (
          <ChatInfoReceiver></ChatInfoReceiver>
        )}

        {messages.length > 0 && (
          <RenderMessages
            messages={messages}
            receiverJoinCvs={receiverJoinCvs}
          />
        )}

        <DisplayTyping />
      </div>
    );
  }
);

const RenderMessages = ({
  messages,
  receiverJoinCvs,
}: {
  messages: IMessage[];
  receiverJoinCvs: boolean;
}) => {
  const { user } = useSelectorAuthSlice();

  const checkDisplayAvatarReceiver = (index: number): boolean => {
    if (index + 1 < messages.length) {
      if (messages[index].senderId === messages[index + 1].senderId) {
        return messages[index].receiverId === messages[index + 1].receiverId
          ? false
          : true;
      } else {
        return true;
      }
    }
    return true;
  };

  const checkDisplayTimeSendMessage = (index: number): boolean => {
    if (user && index + 1 === messages.length) {
      return user._id === messages[index].senderId &&
        !messages[index].receiverSeen
        ? true
        : false;
    }
    return false;
  };

  const checkDisplayReceiverSeenMessage = () => {
    if (receiverJoinCvs) {
      return messages.length - 1;
    }
    if (user) {
      let index = -1;
      for (let i = 0; i < messages.length; i++) {
        if (
          messages[i].senderId === user._id &&
          messages[i].receiverSeen === true
        ) {
          index = i;
        }
        if (messages[i].senderId !== user._id) {
          index = i;
        }
      }
      return index;
    }
    return -1;
  };

  return (
    <div className="flex flex-col gap-y-1">
      {messages.map((item, index) => {
        return (
          <Message
            key={item._id}
            message={item}
            displayAvatar={checkDisplayAvatarReceiver(index)}
            displayTimeSend={checkDisplayTimeSendMessage(index)}
            displayReceiverSeen={
              checkDisplayReceiverSeenMessage() === index ? true : false
            }
          />
        );
      })}
    </div>
  );
};

export default ChatMessages;
