import { IUser } from "@/types/user.type";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IPayload {
  user: IUser | null;
  accessToken?: string;
  isLogin?: boolean;
}

const initialState: IPayload = {
  user: null,
  accessToken: "",
  isLogin: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateAuth: (state, action: PayloadAction<IPayload>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    logOut: (state) => {
      return {
        ...state,
        user: null,
        accessToken: "",
        isLogin: false,
      };
    },
  },
});

export const { updateAuth, logOut } = authSlice.actions;

export default authSlice.reducer;
