import {
  IConversation,
  IMessage,
  IReqSendMessageText,
} from "@/types/chat.type";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../baseQueryToken";
import { IUser } from "@/types/user.type";

export interface IReqGetMessage {
  conversationId: string | null;
  userId: string | null;
  limit: number;
  skip: number;
}

interface IReqSendMessageImages {
  conversationId: string;
  data: FormData;
}

export const chatApi = createApi({
  reducerPath: "chat",
  tagTypes: ["Conversation", "Message"],
  baseQuery: baseQueryWithAuth,
  keepUnusedDataFor: 0,
  refetchOnFocus: false,
  endpoints: (build) => ({
    getConversations: build.query<IConversation[] | null, string>({
      query: (id) => ({
        url: "chat/getConversations/" + id,
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
    getOneConversation: build.query<IConversation, string>({
      query: (id) => ({
        url: "chat/getOneConversation/" + id,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Conversation", id }],
    }),
    getMessages: build.query<IMessage[], IReqGetMessage>({
      query: ({ conversationId, ...params }) => ({
        url: "chat/getMessages/" + conversationId,
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: "Message" as const,
                id: _id,
              })),
              { type: "Message", id: "LIST" },
            ]
          : [{ type: "Message", id: "LIST" }],
    }),
    getOneMessages: build.query<IMessage, string>({
      query: (messageId) => ({
        url: "chat/getOneMessages/" + messageId,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Message", id }],
    }),
    sendMessageText: build.mutation<IMessage, IReqSendMessageText>({
      query: ({ conversationId, ...body }) => ({
        url: "chat/sendMessage/text/" + conversationId,
        method: "POST",
        body,
      }),
    }),
    sendMessageImages: build.mutation<IMessage, IReqSendMessageImages>({
      query: ({ conversationId, ...body }) => ({
        url: "chat/sendMessage/images/" + conversationId,
        method: "POST",
        body,
      }),
    }),
    getUsersChat: build.query<IUser[], string>({
      query: (search) => ({
        url: "chat/getUsersChat",
        method: "GET",
        params: { search },
      }),
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useLazyGetConversationsQuery,
  useLazyGetMessagesQuery,
  useGetMessagesQuery,
  useLazyGetUsersChatQuery,
  useSendMessageTextMutation,
  useSendMessageImagesMutation,
  useLazyGetOneConversationQuery,
  useGetOneMessagesQuery,
  useLazyGetOneMessagesQuery,
} = chatApi;
