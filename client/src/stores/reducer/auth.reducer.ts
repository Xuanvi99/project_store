import { IUser } from "@/types/user.type";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface IPayloadAuth {
  user?: IUser | null;
  accessToken?: string;
  isLogin?: boolean;
}

const initialState: IPayloadAuth = {
  user: null,
  accessToken: "",
  isLogin: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateAuth: (state, action: PayloadAction<IPayloadAuth>) => {
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
