import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IUser } from "../../types/userType";

interface IAuth {
  user: IUser | null;
  accessToken: string;
  error?: boolean;
  errMessage?: string;
}

const initialState: IAuth = {
  user: null,
  accessToken: "",
  error: false,
  errMessage: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<IAuth>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { updateUser } = authSlice.actions;

export default authSlice.reducer;
