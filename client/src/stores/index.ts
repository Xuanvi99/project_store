import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducer";
import { setupListeners } from "@reduxjs/toolkit/query";
import { userAPi } from "./service/user.service";
import { authAPi } from "./service/auth.service";
import { otpAPi } from "./service/otp.service";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (gDM) =>
    gDM().concat([userAPi.middleware, authAPi.middleware, otpAPi.middleware]),
});

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
