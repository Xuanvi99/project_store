import { IConversation, IMessage } from "@/types/chat.type";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../baseQueryToken";
import { IUser } from "@/types/user.type";

interface IParamsGetMessage {
  conversationId: string;
  activePage: number;
}

interface IParamsSendMessageImages {
  conversationId: string;
  data: FormData;
}

interface IParamsSendMessageText {
  conversationId: string;
  senderId: string;
  receiverId: string;
  text: string;
}

export const roomChatApi = createApi({
  reducerPath: "chat",
  tagTypes: ["Conversation", "Message"],
  baseQuery: baseQueryWithAuth,
  endpoints: (build) => ({
    getConversation: build.query<IConversation[] | null, string>({
      query: (id) => ({
        url: "chat/getConversation/" + id,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: "Conversation" as const,
                id: _id,
              })),
              { type: "Conversation", id: "LIST" },
            ]
          : [{ type: "Conversation", id: "LIST" }],
    }),
    getOneConversation: build.query<IConversation | null, string>({
      query: (id) => ({
        url: "chat/getOneConversation/" + id,
        method: "GET",
      }),
      providesTags: [{ type: "Conversation", id: "one" }],
    }),
    getMessages: build.query<IMessage[], IParamsGetMessage>({
      query: ({ conversationId, activePage }) => ({
        url: "chat/getMessages/" + conversationId,
        method: "GET",
        params: { activePage },
      }),
    }),
    sendMessageText: build.mutation<IMessage, IParamsSendMessageText>({
      query: ({ conversationId, ...body }) => ({
        url: "chat/sendMessage/text/" + conversationId,
        method: "POST",
        body,
      }),
    }),
    sendMessageImages: build.mutation<IMessage, IParamsSendMessageImages>({
      query: ({ conversationId, ...body }) => ({
        url: "chat/sendMessage/images/" + conversationId,
        method: "POST",
        body,
      }),
    }),
    getUsersChat: build.query<IUser[], string>({
      query: (search) => ({
        url: "chat/getUsers",
        method: "GET",
        params: { search },
      }),
    }),
  }),
});

export const {
  useGetConversationQuery,
  useLazyGetConversationQuery,
  useLazyGetMessagesQuery,
  useLazyGetUsersChatQuery,
  useSendMessageTextMutation,
  useSendMessageImagesMutation,
  useLazyGetOneConversationQuery,
} = roomChatApi;
