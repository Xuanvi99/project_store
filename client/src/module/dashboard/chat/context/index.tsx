import useSocketIoContext from "@/context/socketIo/useSocketIoContext";
import {
  useAppDispatch,
  useSelectorAuthSlice,
  useSelectorChatSlice,
} from "@/hook";
import { resetChat } from "@/stores/reducer/chat.reducer";
import { useGetConversationsQuery } from "@/stores/service/chat.service";
import { userApi } from "@/stores/service/user.service";
import { IConversation } from "@/types/chat.type";
import { IUser } from "@/types/user.type";
import { QueryStatus } from "@reduxjs/toolkit/query";
import React, {
  createContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

export type TChatProvider = {
  conversations: IConversation<IUser>[] | undefined;

  status: QueryStatus;

  isFetching: boolean;

  isLoading: boolean;

  openSearchResult: boolean;

  handleOpenSearchResult: (status: boolean) => void;
};

const ChatContext = createContext<TChatProvider | null>(null);
function ChatProvide({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  const socketIo_client = useSocketIoContext();

  const { user } = useSelectorAuthSlice();

  const { selectedConversation } = useSelectorChatSlice();

  const {
    data: dataGetConversations,
    status,
    isFetching,
    isLoading,
  } = useGetConversationsQuery(user ? user._id : "", {
    skip: !user,
  });

  const [openSearchResult, SetOpenSearchResult] = useState<boolean>(false);

  const [conversations, setConversations] = useState<IConversation<IUser>[]>(
    []
  );

  const handleOpenSearchResult = (status: boolean) => {
    SetOpenSearchResult(status);
  };

  useLayoutEffect(() => {
    if (dataGetConversations && status === "fulfilled") {
      setConversations(dataGetConversations);
    }
  }, [dataGetConversations, status]);

  useEffect(() => {
    if (conversations.length > 0 && selectedConversation) {
      const index = conversations.findIndex(
        (item) => item._id === selectedConversation._id
      );
      if (index < 0) {
        dispatch(resetChat());
      }
    }
  }, [conversations, dispatch, selectedConversation]);

  useEffect(() => {
    if (socketIo_client) {
      socketIo_client.on(
        "receiverUpdateInfoUser",
        (data: { updateUserId: string }) => {
          console.log("data: ", data);
          dispatch(
            userApi.util.invalidateTags([
              { type: "Users", id: data.updateUserId },
            ])
          );
        }
      );
    }
    return () => {
      if (socketIo_client) {
        socketIo_client.off("receiverUpdateInfoUser");
      }
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
