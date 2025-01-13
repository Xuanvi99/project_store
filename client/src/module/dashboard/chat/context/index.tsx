import useSocketIoContext from "@/context/socketIo/useSocketIoContext";
import { useAppDispatch, useAppSelector } from "@/hook";
import { RootState } from "@/stores";
import { setOnlineUsers } from "@/stores/reducer/chat.reducer";
import { useGetConversationQuery } from "@/stores/service/chat.service";
import { IConversation } from "@/types/chat.type";
import { QueryStatus } from "@reduxjs/toolkit/query";
import React, { createContext, useEffect, useState } from "react";

export type TChatProvider = {
  conversations: IConversation[] | undefined;

  status: QueryStatus;

  openSearchResult: boolean;

  checkConversation: boolean;

  selectedReceiverId: string;

  handleSetConversations: (value: IConversation[]) => void;

  handleSetCheckConversation: (value: boolean) => void;
  handleSelectReceiverId: (id: string) => void;

  handleOpenSearchResult: (status: boolean) => void;
};

const ChatContext = createContext<TChatProvider | null>(null);
function ChatProvide({ children }: { children: React.ReactNode }) {
  const socketIo_client = useSocketIoContext();

  const dispatch = useAppDispatch();

  const user = useAppSelector((state: RootState) => state.authSlice.user);

  const { data: ResGetConversations, status } = useGetConversationQuery(
    user ? user._id : "",
    {
      skip: !user,
    }
  );

  const [openSearchResult, SetOpenSearchResult] = useState<boolean>(false);
  const [conversations, setConversations] = useState<IConversation[]>([]);

  const [selectedReceiverId, setSelectedReceiverId] = useState<string>("");
  console.log("selectedReceiverId: ", selectedReceiverId);

  const [checkConversation, setCheckConversation] = useState<boolean>(false);

  const handleSelectReceiverId = (id: string) => {
    setSelectedReceiverId(id);
  };

  const handleSetConversations = (value: IConversation[]) => {
    return setConversations(value);
  };

  const handleSetCheckConversation = (value: boolean) => {
    setCheckConversation(value);
  };

  const handleOpenSearchResult = (status: boolean) => {
    SetOpenSearchResult(status);
  };

  useEffect(() => {
    if (ResGetConversations && status === "fulfilled") {
      setConversations(ResGetConversations);
    }
  }, [ResGetConversations, status]);

  useEffect(() => {
    if (socketIo_client) {
      socketIo_client.on("getOnlineUsers", (data) => {
        dispatch(setOnlineUsers({ onlineUsers: data as string[] }));
      });
    }

    return () => {
      socketIo_client?.off("getOnlineUsers");
    };
  }, [dispatch, socketIo_client]);

  return (
    <ChatContext.Provider
      value={{
        checkConversation,
        conversations,
        status,
        openSearchResult,
        selectedReceiverId,
        handleSelectReceiverId,
        handleSetCheckConversation,
        handleSetConversations,
        handleOpenSearchResult,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export { ChatProvide, ChatContext };
