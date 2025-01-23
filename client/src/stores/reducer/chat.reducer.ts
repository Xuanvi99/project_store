import { IConversation } from "@/types/chat.type";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IPayload {
  selectedConversation: IConversation | null;
  onlineUsers: string[];
}

const initialState: IPayload = {
  selectedConversation: null,
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
    setOnlineUsers: (
      state,
      action: PayloadAction<Pick<IPayload, "onlineUsers">>
    ) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    resetChat: (state) => {
      return {
        ...state,
        selectedConversation: null,
      };
    },
  },
});

export const {
  updateChat,
  setOnlineUsers,
  setSelectedConversation,
  resetChat,
} = chatSlice.actions;

export default chatSlice.reducer;
