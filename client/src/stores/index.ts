import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducer";
import { setupListeners } from "@reduxjs/toolkit/query";
import { userApi } from "./service/user.service";
import { authApi } from "./service/auth.service";
import { otpApi } from "./service/otp.service";
import { cartApi } from "./service/cart.service";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (gDM) =>
    gDM().concat([
      userApi.middleware,
      authApi.middleware,
      otpApi.middleware,
      cartApi.middleware,
    ]),
});

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
