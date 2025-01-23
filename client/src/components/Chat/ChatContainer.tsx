import { useEffect, useLayoutEffect, useRef, useState } from "react";
import useSocketIoContext from "@/context/socketIo/useSocketIoContext";
import {
  useAppDispatch,
  useSelectorAuthSlice,
  useSelectorChatSlice,
} from "@/hook";
import { IMessage } from "@/types/chat.type";
import {
  chatApi,
  IReqGetMessage,
  useGetMessagesQuery,
} from "@/stores/service/chat.service";
import ChatMessages from "./chatMessages";
import ChatInput from "./ChatInput";

type TParamsGetMessages<Type> = {
  [Property in keyof Type]?: Type[Property];
};
const LIMIT = 15;
function ChatContainer() {
  const socketIo_client = useSocketIoContext();

  const dispatch = useAppDispatch();

  const { selectedConversation } = useSelectorChatSlice();

  const { user } = useSelectorAuthSlice();

  const [paramsGetMessages, setParamsGetMessages] = useState<IReqGetMessage>({
    conversationId: null,
    userId: null,
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

  const clientHeightContainer = useRef<number>(0);

  const [messages, setMessages] = useState<IMessage[]>([]);

  const [textMessage, setTextMessage] = useState<string>("");

  const [countCallApi, setCountCallApi] = useState<number>(0);

  const [containerScrollHeight, setContainerScrollHeight] = useState<number>(0);

  const [containerScrollHeightOld, setContainerScrollHeightOld] =
    useState<number>(0);

  const [openBtnScrollDown, setOpenBtnScrollDown] = useState<boolean>(false);

  const [statusSender, setStatusSender] = useState<boolean>(false);

  const [displayTyping, setDisplayTyping] = useState<boolean>(false);

  const handleChangeTextMessage = (value: string) => {
    setTextMessage(value);
  };

  const handleBtnScrollToBottom = () => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleSetParamsGetMessage = (
    value: TParamsGetMessages<IReqGetMessage>
  ) => {
    setParamsGetMessages((prev) => ({
      ...prev,
      ...value,
    }));
  };

  const handleSenderMessage = (msg: IMessage) => {
    setMessages((messages) => {
      return [...messages, msg];
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
        userId: user._id,
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
  }, [dispatch, selectedConversation, user]);

  useLayoutEffect(() => {
    if (dataGetMessage && status === "fulfilled") {
      setMessages((messages) => {
        return [...dataGetMessage, ...messages];
      });
      setCountCallApi((count) => count + 1);
    }
  }, [dataGetMessage, dispatch, status]);

  //set scrollHeight in chat when scroll to top
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (
      container &&
      selectedConversation &&
      countCallApi >= 1 &&
      messages.length < selectedConversation.totalMessage &&
      !statusSender
    ) {
      if (isFetching) {
        setContainerScrollHeightOld(container.scrollHeight);
      } else {
        setContainerScrollHeight(container.scrollHeight);
      }
    }
  }, [
    messages.length,
    selectedConversation,
    countCallApi,
    isFetching,
    statusSender,
  ]);

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

  //get initial client height container
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      clientHeightContainer.current = container.clientHeight;
    }
  }, []);

  //set scroll top when input modified height
  useEffect(() => {
    const container = containerRef.current;
    if (container && textMessage) {
      const clientHeightOld = clientHeightContainer.current;
      const clientHeightNew = container.clientHeight;
      const scrollTop = container.scrollTop;
      if (
        clientHeightOld !== clientHeightNew &&
        containerScrollHeight === clientHeightOld + scrollTop
      ) {
        const top = containerScrollHeight;
        handleScrollTo(top, "instant");
      }
    }
  }, [containerScrollHeight, textMessage]);

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
      if (container && selectedConversation && messages.length > 0) {
        setOpenBtnScrollDown(
          container.scrollTop + container.clientHeight <
            container.scrollHeight - 40
            ? true
            : false
        );

        if (
          container.scrollTop === 0 &&
          messages.length < selectedConversation.totalMessage
        ) {
          handleSetParamsGetMessage({ skip: paramsGetMessages.skip + LIMIT });
        }
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
  }, [
    containerScrollHeight,
    messages,
    paramsGetMessages.skip,
    selectedConversation,
  ]);

  useEffect(() => {
    const container = containerRef.current;
    if (container && displayTyping) {
      const top = container.scrollHeight;
      handleScrollTo(top, "smooth");
    }
  }, [displayTyping]);

  // socket IO
  useEffect(() => {
    if (socketIo_client) {
      socketIo_client.on("newMessage", (data: IMessage) => {
        setMessages((messages) => [...messages, data]);
        dispatch(chatApi.util.invalidateTags([{ type: "Conversation" }]));
      });
      socketIo_client.on(
        "displayTyping",
        (data: { typing: boolean; senderId: string }) => {
          if (
            selectedConversation &&
            selectedConversation.participants.includes(data.senderId)
          ) {
            setDisplayTyping(data.typing);
          }
        }
      );
    }
    return () => {
      socketIo_client?.off("newMessage");
      socketIo_client?.off("displayTyping");
    };
  }, [dispatch, selectedConversation, socketIo_client]);

  return (
    <div className="flex flex-col justify-end w-full h-full conversation">
      <ChatMessages
        ref={containerRef}
        messages={messages}
        isFetchingData={isFetching}
        displayTyping={displayTyping}
      />
      <ChatInput
        openBtnScrollDown={openBtnScrollDown}
        textMessage={textMessage}
        handleChangeTextMessage={handleChangeTextMessage}
        handleBtnScrollToBottom={handleBtnScrollToBottom}
        handleSenderMessage={handleSenderMessage}
      />
    </div>
  );
}

export default ChatContainer;
