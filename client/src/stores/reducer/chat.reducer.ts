import { IConversation } from "@/types/chat.type";
import { IUser } from "@/types/user.type";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IPayload {
  selectedConversation: IConversation<IUser> | null;
  receiverId: string;
  receiverInfo: IUser | null;
  onlineUsers: string[];
}

type TSetChat = { [P in keyof IPayload]?: IPayload[P] };

const initialState: IPayload = {
  selectedConversation: null,
  receiverId: "",
  receiverInfo: null,
  onlineUsers: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChat: (state, action: PayloadAction<TSetChat>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    setSelectedConversation: (
      state,
      action: PayloadAction<IConversation<IUser> | null>
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

export const { setChat, setOnlineUsers, setSelectedConversation, resetChat } =
  chatSlice.actions;

export default chatSlice.reducer;
