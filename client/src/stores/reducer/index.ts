import { combineReducers } from "@reduxjs/toolkit";
import { userAPi } from "../service/user.service";
import authSlice from "./authReducer";
import { authAPi } from "../service/auth.service";
import { otpAPi } from "../service/otp.service";
const rootReducer = combineReducers({
  [userAPi.reducerPath]: userAPi.reducer,
  [authAPi.reducerPath]: authAPi.reducer,
  [otpAPi.reducerPath]: otpAPi.reducer,
  authSlice: authSlice,
});

export default rootReducer;
