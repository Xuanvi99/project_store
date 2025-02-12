import { useEffect, useLayoutEffect, useRef, useState } from "react";
import useSocketIoContext from "@/context/socketIo/useSocketIoContext";
import {
  useAppDispatch,
  useSelectorAuthSlice,
  useSelectorChatSlice,
} from "@/hook";
import { IMessage, IReqSendMessageText } from "@/types/chat.type";
import {
  chatApi,
  IReqGetMessage,
  useGetMessagesQuery,
} from "@/stores/service/chat.service";
import { IUser } from "@/types/user.type";
import { userApi } from "@/stores/service/user.service";
import ChatViewMessages from "./ChatViewMessages";
import ChatSendMessage from "./ChatSendMessage";
import { ImageType } from "react-images-uploading";
import { setChat } from "@/stores/reducer/chat.reducer";

type TParamsGetMessages<Type> = {
  [Property in keyof Type]?: Type[Property];
};
const LIMIT = 15;

function ChatContainer() {
  const socketIo_client = useSocketIoContext();

  const dispatch = useAppDispatch();

  const { selectedConversation, receiverId, totalMessage } =
    useSelectorChatSlice();

  const { user } = useSelectorAuthSlice();

  const [paramsGetMessages, setParamsGetMessages] = useState<IReqGetMessage>({
    conversationId: null,
    limit: LIMIT,
    skip: 0,
  });

  const {
    data: dataGetMessage,
    status,
    isFetching,
  } = useGetMessagesQuery(paramsGetMessages, {
    skip: !paramsGetMessages.conversationId || !user,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<IMessage<IUser>[]>([]);

  const [images, setImages] = useState<ImageType[]>([]);

  const [waitMessages, setWaitMessages] = useState<IReqSendMessageText[]>([]);

  const [textMessage, setTextMessage] = useState<string>("");

  const [countCallApi, setCountCallApi] = useState<number>(0);

  const [containerScrollHeight, setContainerScrollHeight] = useState<number>(0);

  const [containerScrollHeightOld, setContainerScrollHeightOld] =
    useState<number>(0);

  const [openBtnScrollDown, setOpenBtnScrollDown] = useState<boolean>(false);

  const [statusSender, setStatusSender] = useState<boolean>(false);

  const [receiveMessage, setReceiveMessage] = useState<boolean>(false);

  const [displayTyping, setDisplayTyping] = useState<boolean>(false);

  const [receiverSeenCvs, setReceiverSeenCvs] = useState<boolean>(false);

  const [scrollToBottom, setScrollToBottom] = useState<boolean>(false);

  const handleChangeTextMessage = (value: string) => {
    setTextMessage(value);
  };

  const handleSetImages = (images: ImageType[]) => {
    setImages(images);
  };

  const handleBtnScrollToBottom = async () => {
    try {
      const container = containerRef.current;
      if (container && messages.length > 0 && selectedConversation && user) {
        await dispatch(
          chatApi.endpoints.seenMessages.initiate({
            conversationId: selectedConversation._id,
            userId: user._id,
          })
        )
          .unwrap()
          .then(() => {
            container.scrollTo({
              top: container.scrollHeight,
              behavior: "smooth",
            });
            dispatch(
              chatApi.util.invalidateTags([
                { type: "Message", id: messages[messages.length - 1]._id },
                { type: "Message", id: "CountUnreadMessage" },
              ])
            );
          })
          .catch((error) => {
            throw new Error(error);
          });
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const handleSetParamsGetMessage = (
    value: TParamsGetMessages<IReqGetMessage>
  ) => {
    setParamsGetMessages((prev) => ({
      ...prev,
      ...value,
    }));
  };

  const handleWaitSenderMessage = (msg: IReqSendMessageText) => {
    setWaitMessages((waitMessages) => {
      return [...waitMessages, msg];
    });
    setStatusSender(true);
    setTextMessage("");
  };

  const handleSenderMessage = (msg: IMessage<IUser>) => {
    setMessages((messages) => {
      return [...messages, msg];
    });
    setWaitMessages((waitMessages) => {
      if (waitMessages.length > 1) {
        const messages = waitMessages.splice(0, 1);
        return [...messages];
      }
      return [];
    });
    setStatusSender(true);
    setTextMessage("");
  };

  const handleScrollTo = (top: number, behavior: ScrollBehavior) => {
    if (containerRef.current)
      containerRef.current.scrollTo({
        top,
        behavior,
      });
  };

  useLayoutEffect(() => {
    if (selectedConversation && user) {
      handleSetParamsGetMessage({
        conversationId: selectedConversation._id,
        skip: 0,
      });
    }
    setMessages([]);
    setCountCallApi(0);
    setContainerScrollHeight(0);
    setContainerScrollHeightOld(0);
    setTextMessage("");
    setStatusSender(false);
    setOpenBtnScrollDown(false);
    setDisplayTyping(false);
    setReceiveMessage(false);
    setReceiverSeenCvs(false);
    setScrollToBottom(false);
    setImages([]);
  }, [selectedConversation, user]);

  useLayoutEffect(() => {
    if (dataGetMessage && status === "fulfilled") {
      setMessages((messages) => {
        return [...dataGetMessage, ...messages];
      });
      setCountCallApi((count) => count + 1);
    }
  }, [dataGetMessage, status]);

  //set scrollHeight in chat when scroll to top
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (
      container &&
      selectedConversation &&
      countCallApi >= 1 &&
      !statusSender
    ) {
      if (isFetching) {
        setContainerScrollHeightOld(container.scrollHeight);
      } else {
        setContainerScrollHeight(container.scrollHeight);
      }
    }
  }, [selectedConversation, countCallApi, isFetching, statusSender]);

  // scroll down first load chat message
  useEffect(() => {
    const container = containerRef.current;
    if (container && countCallApi === 1) {
      const top = container.scrollHeight;
      handleScrollTo(top, "instant");
      setContainerScrollHeight(container.scrollHeight);
      setContainerScrollHeightOld(container.scrollHeight);
    }
  }, [countCallApi]);

  //load message older but keep scroll position
  useEffect(() => {
    const container = containerRef.current;
    if (container && containerScrollHeight > containerScrollHeightOld) {
      const top = containerScrollHeight - containerScrollHeightOld;
      handleScrollTo(top, "instant");
      setContainerScrollHeightOld(container.scrollHeight);
    }
  }, [containerScrollHeight, containerScrollHeightOld]);

  //set scroll top when input or images modified height
  useEffect(() => {
    const container = containerRef.current;
    handleScrollTo(1033, "instant");
    if (container && scrollToBottom) {
      const top = containerScrollHeight;
      handleScrollTo(top, "instant");
    }
  }, [containerScrollHeight, scrollToBottom, textMessage, images]);

  //scroll to down when sender message
  useEffect(() => {
    const container = containerRef.current;
    if (selectedConversation && container) {
      const top = container.scrollHeight;
      handleScrollTo(top, "smooth");
      setContainerScrollHeight(container.scrollHeight);
      setContainerScrollHeightOld(container.scrollHeight);
      if (statusSender) setStatusSender(false);
    }
  }, [selectedConversation, statusSender]);

  // add event scroll view
  useEffect(() => {
    const container = containerRef.current;
    const handleScrollView = () => {
      if (container && messages.length > 0) {
        setOpenBtnScrollDown(
          container.scrollTop + container.clientHeight <
            container.scrollHeight - 50
            ? true
            : false
        );

        if (container.scrollTop === 0 && messages.length < totalMessage) {
          handleSetParamsGetMessage({ skip: paramsGetMessages.skip + LIMIT });
        }

        container.scrollTop + container.clientHeight === container.scrollHeight
          ? setScrollToBottom(true)
          : setScrollToBottom(false);
      }
    };
    if (container) {
      container.addEventListener("scroll", handleScrollView);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScrollView);
      }
    };
  }, [containerScrollHeight, messages, paramsGetMessages.skip, totalMessage]);

  // scroll when typing and scroll to bottom
  useEffect(() => {
    const container = containerRef.current;
    if (container && displayTyping && scrollToBottom) {
      const top = container.scrollHeight;
      handleScrollTo(top, "smooth");
    }
  }, [displayTyping, scrollToBottom]);

  // scroll when receive message
  useEffect(() => {
    const container = containerRef.current;
    if (container && receiveMessage && scrollToBottom) {
      const top = container.scrollHeight;
      handleScrollTo(top, "smooth");
      setReceiveMessage(false);
    }
  }, [containerScrollHeight, receiveMessage, scrollToBottom]);

  // socket IO
  useEffect(() => {
    if (socketIo_client && selectedConversation && user && receiverId) {
      socketIo_client.emit("seenConversation", {
        seen: scrollToBottom,
        conversationId: selectedConversation._id,
        receiverId: receiverId,
      });

      socketIo_client.on(
        "checkReceiverSeenCvs",
        (data: { conversationId: string }) => {
          const { conversationId } = data;
          const container = containerRef.current;
          if (container) {
            socketIo_client.emit("resultCheckSeenCvs", {
              seen:
                conversationId === selectedConversation._id && scrollToBottom
                  ? true
                  : false,
              conversationId: selectedConversation._id,
              receiverId: receiverId,
            });
          }
        }
      );

      socketIo_client.on(
        "statusReceiverSeen",
        (data: { seen: boolean; conversationId: string }) => {
          const { conversationId, seen } = data;
          if (conversationId === selectedConversation._id) {
            setReceiverSeenCvs(seen);
          }
        }
      );
    }
    return () => {
      socketIo_client?.off("checkReceiverSeenCvs");
      socketIo_client?.off("statusReceiverSeen");
      socketIo_client?.emit("seenConversation", {
        seen: false,
        conversationId: selectedConversation?._id,
        receiverId: receiverId,
      });
    };
  }, [receiverId, scrollToBottom, selectedConversation, socketIo_client, user]);

  useEffect(() => {
    if (socketIo_client && selectedConversation && user && receiverId) {
      socketIo_client.emit("checkReceiverSeenCvs", {
        receiverId: receiverId,
        conversationId: selectedConversation._id,
      });

      socketIo_client.on(
        "receiveMessage",
        (data: {
          conversationId: string;
          message: IMessage<IUser>;
          totalMessage: number;
        }) => {
          const { conversationId, message, totalMessage } = data;
          if (conversationId === selectedConversation._id) {
            setMessages((messages) => [...messages, message]);
            setReceiveMessage(true);
            dispatch(setChat({ totalMessage }));
            dispatch(
              chatApi.util.invalidateTags([
                { type: "Message", id: "CountUnreadMessage" },
              ])
            );
            dispatch(
              chatApi.util.invalidateTags([
                { type: "Conversation", id: conversationId },
              ])
            );
          }
        }
      );

      socketIo_client.on("updateInfoUser", (data: { updateUserId: string }) => {
        dispatch(
          userApi.util.invalidateTags([
            { type: "Users", id: data.updateUserId },
          ])
        );
      });

      socketIo_client.on(
        "displayTyping",
        (data: { typing: boolean; senderId: string }) => {
          if (data.senderId === receiverId) {
            setDisplayTyping(data.typing);
          }
        }
      );
    }
    return () => {
      socketIo_client?.off("receiveMessage");
      socketIo_client?.off("displayTyping");
    };
  }, [dispatch, receiverId, selectedConversation, socketIo_client, user]);

  return (
    <div className="flex flex-col justify-end w-full h-full conversation">
      <ChatViewMessages
        ref={containerRef}
        messages={messages}
        waitMessages={waitMessages}
        isFetchingData={isFetching}
        isDisplayTyping={displayTyping}
        receiverSeenCvs={receiverSeenCvs}
      />
      <ChatSendMessage
        openBtnScrollDown={openBtnScrollDown}
        textMessage={textMessage}
        receiverSeenCvs={receiverSeenCvs}
        handleChangeTextMessage={handleChangeTextMessage}
        handleBtnScrollToBottom={handleBtnScrollToBottom}
        handleSenderMessage={handleSenderMessage}
        handleWaitSenderMessage={handleWaitSenderMessage}
        handleSetImages={handleSetImages}
      />
    </div>
  );
}

export default ChatContainer;
