import { useEffect, useLayoutEffect, useRef, useState } from "react";
import useSocketIoContext from "@/context/socketIo/useSocketIoContext";
import {
  useAppDispatch,
  useSelectorAuthSlice,
  useSelectorChatSlice,
} from "@/hook";
import { IMessage, IReqSendMessage } from "@/types/chat.type";
import {
  chatApi,
  IReqGetMessage,
  useGetMessagesQuery,
} from "@/stores/service/chat.service";
import { IUser } from "@/types/user.type";
import { userApi } from "@/stores/service/user.service";
import ChatViewMessages from "./ChatViewMessages.draft";
import ChatSendMessage from "../ChatSendMessage";
import { ImageType } from "react-images-uploading";
import { setChat } from "@/stores/reducer/chat.reducer";
import { ChatProvider } from "../context";

type TParamsGetMessages<Type> = {
  [Property in keyof Type]?: Type[Property];
};
const LIMIT = 20;

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
    skip:
      !selectedConversation ||
      paramsGetMessages.conversationId !== selectedConversation._id ||
      !user,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  const clientHeightContainer = useRef<number>(0);

  const [messages, setMessages] = useState<IMessage<IUser>[]>([]);

  const [images, setImages] = useState<ImageType[]>([]);

  const [waitMessages, setWaitMessages] = useState<IReqSendMessage[]>([]);

  const [messageText, setMessageText] = useState<string>("");

  const [firstLoadData, setFirstLoadData] = useState<boolean>(false);

  const [containerScrollHeight, setContainerScrollHeight] = useState<number>(0);

  const [containerScrollHeightOld, setContainerScrollHeightOld] =
    useState<number>(0);

  const [openBtnScrollDown, setOpenBtnScrollDown] = useState<boolean>(false);

  const [statusSend, setStatusSend] = useState<boolean>(false);

  const [receiveMessage, setReceiveMessage] = useState<boolean>(false);

  const [displayTyping, setDisplayTyping] = useState<boolean>(false);

  const [receiverSeenCvs, setReceiverSeenCvs] = useState<boolean>(false);

  const [scrollToBottom, setScrollToBottom] = useState<boolean>(false);

  const [openScrollY, setOpenScrollY] = useState<boolean>(false);

  const handleChangeMessageText = (value: string) => {
    setMessageText(value);
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

  const handleSetWaitMessages = (msg: IReqSendMessage) => {
    setWaitMessages((waitMessages) => {
      return [...waitMessages, msg];
    });
    setStatusSend(true);
    setMessageText("");
  };

  const handleSetMessages = (msg: IMessage<IUser>) => {
    setMessages((messages) => {
      if (messages.some((m) => m._id === msg._id)) return messages;
      return [...messages, msg];
    });
    setWaitMessages((waitMessages) => {
      if (waitMessages.length > 0) {
        const messages = waitMessages.splice(0, 1);
        return [...messages];
      }
      return [];
    });
    setStatusSend(true);
    setMessageText("");
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
      setMessageText("");
      setMessages([]);
      setFirstLoadData(true);
      setContainerScrollHeight(0);
      setContainerScrollHeightOld(0);
      setStatusSend(false);
      setOpenBtnScrollDown(false);
      setDisplayTyping(false);
      setReceiveMessage(false);
      setReceiverSeenCvs(false);
      setScrollToBottom(false);
      setImages([]);
    }
  }, [selectedConversation, user]);

  useLayoutEffect(() => {
    if (dataGetMessage && status === "fulfilled") {
      setMessages((messages) => {
        return [...dataGetMessage, ...messages];
      });
      setFirstLoadData(true);
    }
  }, [dataGetMessage, status]);

  //set scrollHeight in chat when scroll to top
  // useLayoutEffect(() => {
  //   const container = containerRef.current;
  //   if (container && selectedConversation && !firstLoadData && !statusSend) {
  //     if (isFetching) {
  //       setContainerScrollHeightOld(container.scrollHeight);
  //     } else {
  //       setContainerScrollHeight(container.scrollHeight);
  //     }
  //   }
  // }, [selectedConversation, firstLoadData, isFetching, statusSend]);

  // useLayoutEffect(() => {
  //   const container = containerRef.current;
  //   if (container && firstLoadData) {
  //     clientHeightContainer.current = container.clientHeight;
  //   }
  // }, [firstLoadData]);

  // useLayoutEffect(() => {
  //   const container = containerRef.current;
  //   if (container) {
  //     setOpenScrollY(
  //       container.scrollHeight === clientHeightContainer.current ? false : true
  //     );
  //   }
  // }, [messages, messageText, images]);

  // scroll down first load chat message
  // useEffect(() => {
  //   const container = containerRef.current;
  //   if (container && firstLoadData && openScrollY) {
  //     const top = container.scrollHeight;
  //     handleScrollTo(top, "instant");
  //     setContainerScrollHeight(container.scrollHeight);
  //     setContainerScrollHeightOld(container.scrollHeight);
  //     setFirstLoadData(false);
  //   }
  // }, [firstLoadData, openScrollY]);

  //load message older but keep scroll position
  // useEffect(() => {
  //   const container = containerRef.current;
  //   if (container && containerScrollHeight > containerScrollHeightOld) {
  //     const top = containerScrollHeight - containerScrollHeightOld;
  //     handleScrollTo(top, "instant");
  //     setContainerScrollHeightOld(container.scrollHeight);
  //   }
  // }, [containerScrollHeight, containerScrollHeightOld]);

  //set scroll top when input or images modified height
  // useEffect(() => {
  //   const container = containerRef.current;
  //   if (container && scrollToBottom) {
  //     const top = container.scrollHeight;
  //     handleScrollTo(top, "instant");
  //   }
  // }, [scrollToBottom, messageText, images]);

  //scroll to down when sender message
  useEffect(() => {
    const container = containerRef.current;
    if (selectedConversation && container) {
      const top = container.scrollHeight;
      handleScrollTo(top, "smooth");
      setContainerScrollHeight(container.scrollHeight);
      setContainerScrollHeightOld(container.scrollHeight);
      if (statusSend) setStatusSend(false);
    }
  }, [selectedConversation, statusSend]);

  // add event scroll view
  // useEffect(() => {
  //   const container = containerRef.current;
  //   const handleScrollView = () => {
  //     if (container && messages.length > 0) {
  //       setOpenBtnScrollDown(
  //         container.scrollTop + container.clientHeight <
  //           container.scrollHeight - 100
  //           ? true
  //           : false
  //       );

  //       if (container.scrollTop === 0 && messages.length < totalMessage) {
  //         handleSetParamsGetMessage({ skip: paramsGetMessages.skip + LIMIT });
  //       }

  //       container.scrollTop + container.clientHeight === container.scrollHeight
  //         ? setScrollToBottom(true)
  //         : setScrollToBottom(false);
  //     }
  //   };
  //   if (container) {
  //     container.addEventListener("scroll", handleScrollView);
  //   }
  //   return () => {
  //     if (container) {
  //       container.removeEventListener("scroll", handleScrollView);
  //     }
  //   };
  // }, [containerScrollHeight, messages, paramsGetMessages.skip, totalMessage]);

  // scroll when typing and scroll to bottom
  // useEffect(() => {
  //   const container = containerRef.current;
  //   if (container && displayTyping && scrollToBottom) {
  //     const top = container.scrollHeight;
  //     handleScrollTo(top, "smooth");
  //   }
  // }, [displayTyping, scrollToBottom]);

  // scroll when receive message
  // useEffect(() => {
  //   const container = containerRef.current;
  //   if (container && receiveMessage && scrollToBottom) {
  //     const top = container.scrollHeight;
  //     handleScrollTo(top, "smooth");
  //     setReceiveMessage(false);
  //   }
  // }, [receiveMessage, scrollToBottom]);

  // socket IO
  useEffect(() => {
    if (socketIo_client && selectedConversation && user && receiverId) {
      // thông báo cho ng nhận bạn đang trong conversation
      socketIo_client.emit("seenConversation", {
        seen: scrollToBottom,
        conversationId: selectedConversation._id,
        receiverId: receiverId,
      });

      // nhận thông báo check xem receiver có đang xem mesage và trả về kết quả
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

      // nhận thông báo xem người nhận có đang xem message hay ko
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
      //Check xem người nhận có đang trong conversiton ko
      socketIo_client.emit("checkReceiverSeenCvs", {
        receiverId: receiverId,
        conversationId: selectedConversation._id,
      });

      // listen to messages
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

      // lắng nghe nếu reciver update info cập nhật lại info bên này
      socketIo_client.on("updateInfoUser", (data: { updateUserId: string }) => {
        dispatch(
          userApi.util.invalidateTags([
            { type: "Users", id: data.updateUserId },
          ])
        );
      });

      // lắng nghe typing to receiver
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
    <ChatProvider>
      <div className="flex flex-col justify-end w-full h-full conversation">
        <ChatViewMessages
          ref={containerRef}
          messages={messages}
          waitMessages={waitMessages}
          isFetchingData={isFetching}
          isDisplayTyping={displayTyping}
          receiverSeenCvs={receiverSeenCvs}
          openScrollY={openScrollY}
        />
        <ChatSendMessage
          openBtnScrollDown={openBtnScrollDown}
          receiverSeenCvs={receiverSeenCvs}
          handleChangeMessageText={handleChangeMessageText}
          handleBtnScrollToBottom={handleBtnScrollToBottom}
          handleSetMessages={handleSetMessages}
          handleSetWaitMessages={handleSetWaitMessages}
          handleSetImages={handleSetImages}
        />
      </div>
    </ChatProvider>
  );
}

export default ChatContainer;
