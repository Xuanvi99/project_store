import useSocketIoContext from "@/context/socketIo/useSocketIoContext";
import {
  useAppDispatch,
  useSelectorAuthSlice,
  useSelectorChatSlice,
} from "@/hook";
import { setChat } from "@/stores/reducer/chat.reducer";
import {
  chatApi,
  IReqGetMessage,
  useGetMessagesQuery,
} from "@/stores/service/chat.service";
import { userApi } from "@/stores/service/user.service";
import { IMessage, IReqSendMessage } from "@/types/chat.type";
import { IUser } from "@/types/user.type";
import {
  createContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export type TChatProvider = {
  containerDivRef: React.RefObject<HTMLDivElement>;
  messages: IMessage<IUser>[];
  isFetchingData: boolean;
  previewMessages: IReqSendMessage[];
  receiverSeen: boolean;
  paramsGetMessages: IReqGetMessage;
  openBtnScrollDown: boolean;
  checkScrollToBottom: boolean;
  checkMessageReceive: boolean;
  sizeChatView: "mini" | "big";
  setSizeChatView: React.Dispatch<React.SetStateAction<"mini" | "big">>;
  setOpenBtnScrollDown: React.Dispatch<React.SetStateAction<boolean>>;
  setCheckScrollToBottom: React.Dispatch<React.SetStateAction<boolean>>;
  handleScrollTo: (top: number, behavior: ScrollBehavior) => void;
  handleSetMessages: (msg: IMessage<IUser>) => void;
  handleSetPreviewMessages: (msg: IReqSendMessage) => void;
  handleBtnScrollToBottom: () => void;
  handleSplicePreviewMessage: () => void;
  handleSetParamsGetMessage: (
    value: TParamsGetMessages<IReqGetMessage>
  ) => void;
};

type TParamsGetMessages<Type> = {
  [Property in keyof Type]?: Type[Property];
};

export const LIMIT_GET_MESSAGE = 20;

const ChatContext = createContext<TChatProvider | null>(null);
function ChatProvider({ children }: { children: React.ReactNode }) {
  const socketIo_client = useSocketIoContext();

  const dispatch = useAppDispatch();

  const { selectedConversation, receiverId } = useSelectorChatSlice();

  const { user } = useSelectorAuthSlice();

  const [paramsGetMessages, setParamsGetMessages] = useState<IReqGetMessage>({
    conversationId: null,
    limit: LIMIT_GET_MESSAGE,
    skip: 0,
  });

  const {
    data: dataGetMessage,
    status,
    isFetching: isFetchingData,
  } = useGetMessagesQuery(paramsGetMessages, {
    skip:
      !selectedConversation ||
      paramsGetMessages.conversationId !== selectedConversation._id,
  });

  const containerDivRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<IMessage<IUser>[]>([]);

  const [previewMessages, setPreviewMessages] = useState<IReqSendMessage[]>([]);

  const [countCallData, setCountCallData] = useState<number>(0);

  const [sizeChatView, setSizeChatView] = useState<"mini" | "big">("big");

  const [openBtnScrollDown, setOpenBtnScrollDown] = useState<boolean>(false);

  const [checkMessageReceive, setCheckMessageReceive] =
    useState<boolean>(false);

  const [receiverSeen, setReceiverSeen] = useState<boolean>(false);

  const [checkScrollToBottom, setCheckScrollToBottom] =
    useState<boolean>(false);

  const handleSetParamsGetMessage = (
    value: TParamsGetMessages<IReqGetMessage>
  ) => {
    setParamsGetMessages((prev) => ({
      ...prev,
      ...value,
    }));
  };

  const handleSetMessages = (msg: IMessage<IUser>) => {
    setMessages((messages) => {
      if (messages.some((m) => m._id === msg._id)) return messages;
      return [...messages, msg];
    });
  };

  const handleSplicePreviewMessage = () => {
    setPreviewMessages((previewMessages) => {
      if (previewMessages.length > 0) {
        const messages = previewMessages.splice(0, 1);
        return [...messages];
      }
      return [];
    });
  };

  const handleSetPreviewMessages = (msg: IReqSendMessage) => {
    setPreviewMessages((previewMessages) => {
      return [...previewMessages, msg];
    });
  };

  const handleBtnScrollToBottom = async () => {
    try {
      const container = containerDivRef.current;
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

  const handleScrollTo = (top: number, behavior: ScrollBehavior) => {
    if (containerDivRef.current)
      containerDivRef.current.scrollTo({
        top,
        behavior,
      });
  };

  useLayoutEffect(() => {
    if (
      selectedConversation &&
      paramsGetMessages.conversationId !== selectedConversation._id
    ) {
      handleSetParamsGetMessage({
        conversationId: selectedConversation._id,
        skip: 0,
      });
      setMessages([]);
      setPreviewMessages([]);
      setReceiverSeen(false);
      setCountCallData(0);
      setCheckScrollToBottom(false);
      setCheckMessageReceive(false);
      setOpenBtnScrollDown(false);
    }
  }, [paramsGetMessages.conversationId, selectedConversation]);

  useLayoutEffect(() => {
    if (dataGetMessage && status === "fulfilled") {
      setMessages((messages) => {
        return [...dataGetMessage, ...messages];
      });
      setCountCallData((count) => count + 1);
    }
  }, [dataGetMessage, status]);

  // scroll down first load chat message
  useEffect(() => {
    const container = containerDivRef.current;
    if (container && countCallData === 1) {
      const top = container.scrollHeight;
      handleScrollTo(top, "instant");
    }
  }, [countCallData]);

  // scroll when receive message
  useEffect(() => {
    const container = containerDivRef.current;
    if (container && checkMessageReceive && checkScrollToBottom) {
      const top = container.scrollHeight;
      handleScrollTo(top, "smooth");
      setCheckMessageReceive(false);
    }
  }, [checkMessageReceive, checkScrollToBottom]);

  //socket IO
  const setupSocketListenersEmit = () => {
    if (!socketIo_client || !selectedConversation || !user || !receiverId)
      return;

    socketIo_client.emit("checkReceiverSeen", {
      receiverId: receiverId,
      conversationId: selectedConversation._id,
    });

    // thông báo cho ng nhận bạn đang trong conversation
    socketIo_client.emit("notificationSeenConversation", {
      seen: checkScrollToBottom,
      conversationId: selectedConversation._id,
      receiverId,
    });

    return () => {
      socketIo_client.emit("seenConversation", {
        seen: false,
        conversationId: selectedConversation?._id,
        receiverId,
      });
    };
  };

  const setupSocketListenersOn = () => {
    if (!socketIo_client || !selectedConversation || !user || !receiverId)
      return;

    // nhận thông báo check xem receiver có đang trong conversation và trả về kết quả
    socketIo_client.on(
      "checkReceiverSeen",
      (data: { conversationId: string }) => {
        const { conversationId } = data;
        socketIo_client.emit("resultCheckSeen", {
          seen:
            conversationId === selectedConversation._id && checkScrollToBottom
              ? true
              : false,
          conversationId: selectedConversation._id,
          receiverId: receiverId,
        });
      }
    );

    // nhận thông báo xem người nhận có đang xem message hay ko
    socketIo_client.on(
      "statusReceiverSeen",
      (data: { seen: boolean; conversationId: string }) => {
        const { conversationId, seen } = data;
        if (conversationId === selectedConversation._id) {
          setReceiverSeen(seen);
        }
      }
    );

    // listen to  messages receive
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
          setCheckMessageReceive(true);

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

    // listen to update info user
    socketIo_client.on("updateInfoUser", (data: { updateUserId: string }) => {
      dispatch(
        userApi.util.invalidateTags([{ type: "Users", id: data.updateUserId }])
      );
    });

    return () => {
      socketIo_client?.off("checkReceiverSeen");
      socketIo_client?.off("statusReceiverSeen");
      socketIo_client?.off("receiveMessage");
    };
  };

  useEffect(setupSocketListenersEmit, [
    checkScrollToBottom,
    receiverId,
    selectedConversation,
    socketIo_client,
    user,
  ]);

  useEffect(setupSocketListenersOn, [
    selectedConversation,
    user,
    receiverId,
    socketIo_client,
    checkScrollToBottom,
    dispatch,
  ]);

  const data: TChatProvider = {
    containerDivRef,
    messages,
    isFetchingData,
    previewMessages,
    receiverSeen,
    paramsGetMessages,
    checkScrollToBottom,
    openBtnScrollDown,
    checkMessageReceive,
    sizeChatView,
    setCheckScrollToBottom,
    setOpenBtnScrollDown,
    setSizeChatView,
    handleScrollTo,
    handleSetParamsGetMessage,
    handleBtnScrollToBottom,
    handleSetMessages,
    handleSetPreviewMessages,
    handleSplicePreviewMessage,
  };

  return <ChatContext.Provider value={data}>{children}</ChatContext.Provider>;
}

export { ChatProvider, ChatContext };
