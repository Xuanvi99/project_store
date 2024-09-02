import { IRoomChat } from "@/types/chat.type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const roomChatApi = createApi({
  reducerPath: "roomChat",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_DOMAIN_SERVER + "/api/roomChat/",
    credentials: "include",
  }),
  endpoints: (build) => ({
    getRoomChatBuyer: build.query<IRoomChat, string>({
      query: (buyerId) => ({
        url: "getRoomChatBuyer/" + buyerId,
        method: "GET",
      }),
    }),
    getRoomChatAdmin: build.query<
      IRoomChat,
      { adminId: string; buyerId: string }
    >({
      query: (params) => ({
        url: "getRoomChatAdmin",
        method: "GET",
        params,
      }),
    }),
  }),
});

export const { useGetRoomChatAdminQuery, useGetRoomChatBuyerQuery } =
  roomChatApi;
