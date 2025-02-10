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
  limit: number;
  skip: number;
}

interface IReqSendMessageImages {
  conversationId: string;
  data: FormData;
}

interface IReqSeenMessages {
  conversationId: string | null;
  userId: string | null;
}
interface IReqUnreadMessages {
  conversationId: string;
  userId: string;
}

export const chatApi = createApi({
  reducerPath: "chat",
  tagTypes: ["Conversation", "Message"],
  baseQuery: baseQueryWithAuth,
  keepUnusedDataFor: 0,
  refetchOnFocus: false,
  endpoints: (build) => ({
    getConversations: build.query<IConversation<IUser>[] | null, string>({
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
    getOneConversation: build.query<IConversation<IUser>, string>({
      query: (id) => ({
        url: "chat/getOneConversation/" + id,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Conversation", id }],
    }),
    getMessages: build.query<IMessage<IUser>[], IReqGetMessage>({
      query: ({ conversationId, ...params }) => ({
        url: "chat/getMessages/" + conversationId,
        method: "GET",
        params,
      }),
      providesTags: () => [{ type: "Message", id: "LIST" }],
    }),
    getOneMessages: build.query<IMessage<IUser>, string>({
      query: (messageId) => ({
        url: "chat/getOneMessages/" + messageId,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Message", id }],
    }),
    sendMessageText: build.mutation<IMessage<IUser>, IReqSendMessageText>({
      query: ({ conversationId, ...body }) => ({
        url: "chat/sendMessage/text/" + conversationId,
        method: "POST",
        body,
      }),
    }),
    sendMessageImages: build.mutation<IMessage<IUser>, IReqSendMessageImages>({
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
    seenMessages: build.mutation<string, IReqSeenMessages>({
      query: ({ conversationId, ...body }) => ({
        url: "chat/seenMessages/" + conversationId,
        method: "PUT",
        body,
      }),
    }),
    getUnreadMessage: build.query<{ amount: number }, IReqUnreadMessages>({
      query: ({ conversationId, ...params }) => ({
        url: "chat/unreadMessage/" + conversationId,
        method: "GET",
        params,
      }),
      providesTags: [{ type: "Message", id: "CountUnreadMessage" }],
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
  useSeenMessagesMutation,
  useLazyGetUnreadMessageQuery,
  useGetUnreadMessageQuery,
} = chatApi;
