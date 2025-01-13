import { IMessage, IConversation } from "@/types/chat.type";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IPayload {
  selectedConversation: IConversation | null;
  messages: IMessage[];
  onlineUsers: string[];
}

const initialState: IPayload = {
  selectedConversation: null,
  messages: [],
  onlineUsers: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    updateChat: (state, action: PayloadAction<IPayload>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    setSelectedConversation: (
      state,
      action: PayloadAction<IConversation | null>
    ) => {
      return {
        ...state,
        selectedConversation: action.payload,
      };
    },
    setMessages: (state, action: PayloadAction<IMessage[]>) => {
      return {
        ...state,
        messages: action.payload,
      };
    },
    setOnlineUsers: (
      state,
      action: PayloadAction<Pick<IPayload, "onlineUsers">>
    ) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const {
  updateChat,
  setMessages,
  setOnlineUsers,
  setSelectedConversation,
} = chatSlice.actions;

export default chatSlice.reducer;
