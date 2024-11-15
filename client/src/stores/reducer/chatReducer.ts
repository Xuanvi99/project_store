import { IMessage, IRoomChat } from "@/types/chat.type";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IPayload {
  roomChat: IRoomChat | null;
  message: IMessage[];
}

const initialState: IPayload = {
  roomChat: null,
  message: [],
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
    setRoomChat: (state, action: PayloadAction<Pick<IPayload, "roomChat">>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    setMessage: (state, action: PayloadAction<Pick<IPayload, "message">>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { updateChat, setRoomChat, setMessage } = chatSlice.actions;

export default chatSlice.reducer;
