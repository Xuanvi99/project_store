import { combineReducers } from "@reduxjs/toolkit";
import { userApi } from "../service/user.service";
import authSlice from "./authReducer";
import { authApi } from "../service/auth.service";
import { otpApi } from "../service/otp.service";
import cartSlice from "./cartReducer";
import { cartApi } from "../service/cart.service";

const rootReducer = combineReducers({
  [userApi.reducerPath]: userApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [otpApi.reducerPath]: otpApi.reducer,
  [cartApi.reducerPath]: cartApi.reducer,
  authSlice: authSlice,
  cartSlice: cartSlice,
});

export default rootReducer;
