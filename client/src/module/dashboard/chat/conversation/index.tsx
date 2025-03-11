import {
  useAppDispatch,
  useSelectorAuthSlice,
  useSelectorChatSlice,
} from "@/hook";
import SkeletonConversation from "../skeleton/SkeletonConversation";
import ConversationsList from "./list";
import ConversationSearch from "./search";
import useSocketIoContext from "@/context/socketIo/useSocketIoContext";
import {
  chatApi,
  useGetConversationsQuery,
} from "@/stores/service/chat.service";
import { useEffect, useLayoutEffect, useState } from "react";
import { IConversation } from "@/types/chat.type";
import { IUser } from "@/types/user.type";
import { userApi } from "@/stores/service/user.service";
import { resetChat } from "@/stores/reducer/chat.reducer";

function ChatAllConversations() {
  const dispatch = useAppDispatch();

  const socketIo_client = useSocketIoContext();

  const { selectedConversation } = useSelectorChatSlice();

  const { user } = useSelectorAuthSlice();

  const {
    data: dataGetConversations,
    status,
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
    if (selectedConversation && conversations) {
      const result = conversations.find(
        (item) => item._id === selectedConversation._id
      );
      if (!result) {
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
      socketIo_client.on("receiveMessage", (data) => {
        console.log("data: ", data);
        dispatch(chatApi.util.invalidateTags([{ type: "Conversation" }]));
      });
    }
    return () => {
      if (socketIo_client) {
        socketIo_client.off("receiverUpdateInfoUser");
        socketIo_client.off("receiveMessage");
      }
    };
  }, [dispatch, socketIo_client]);

  if (isLoading) return <SkeletonConversation />;

  return (
    <div className="flex basis-[30%] h-full overflow-hidden bg-white rounded-lg max-w-[315px]">
      <div className="flex flex-col w-full p-3 gap-y-2">
        <div className="flex items-center gap-x-3">
          <p className="text-xl font-semibold">Danh sách tin nhắn</p>
        </div>
        <ConversationSearch
          openSearchResult={openSearchResult}
          handleOpenSearchResult={handleOpenSearchResult}
        />
        <ConversationsList
          conversations={conversations}
          openSearchResult={openSearchResult}
        />
      </div>
    </div>
  );
}

export default ChatAllConversations;
