import useSocketIoContext from "@/context/socketIo/useSocketIoContext";
import { useAppDispatch, useSelectorAuthSlice } from "@/hook";
import { resetChat } from "@/stores/reducer/chat.reducer";
import {
  chatApi,
  useGetConversationsQuery,
} from "@/stores/service/chat.service";
import { IConversation } from "@/types/chat.type";
import { QueryStatus } from "@reduxjs/toolkit/query";
import React, {
  createContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

export type TChatProvider = {
  conversations: IConversation[] | undefined;

  status: QueryStatus;

  isFetching: boolean;

  isLoading: boolean;

  openSearchResult: boolean;

  handleOpenSearchResult: (status: boolean) => void;
};

const ChatContext = createContext<TChatProvider | null>(null);
function ChatProvide({ children }: { children: React.ReactNode }) {
  const socketIo_client = useSocketIoContext();

  const dispatch = useAppDispatch();

  const { user } = useSelectorAuthSlice();

  const {
    data: dataGetConversations,
    status,
    isFetching,
    isLoading,
  } = useGetConversationsQuery(user ? user._id : "", {
    skip: !user,
  });

  const [openSearchResult, SetOpenSearchResult] = useState<boolean>(false);

  const [conversations, setConversations] = useState<IConversation[]>([]);

  const handleOpenSearchResult = (status: boolean) => {
    SetOpenSearchResult(status);
  };

  useLayoutEffect(() => {
    if (dataGetConversations && status === "fulfilled") {
      setConversations(dataGetConversations);
    }
  }, [dataGetConversations, status]);

  useEffect(() => {
    if (socketIo_client) {
      socketIo_client.on("receiveMessage", () => {
        dispatch(chatApi.util.invalidateTags([{ type: "Conversation" }]));
      });
    }

    return () => {
      dispatch(resetChat());
      socketIo_client?.off("receiveMessage");
    };
  }, [dispatch, socketIo_client]);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        status,
        isFetching,
        isLoading,
        openSearchResult,
        handleOpenSearchResult,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export { ChatProvide, ChatContext };
