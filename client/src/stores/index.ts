import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducer";
import { setupListeners } from "@reduxjs/toolkit/query";
import { userApi } from "./service/user.service";
import { authApi } from "./service/auth.service";
import { otpApi } from "./service/otp.service";
import { cartApi } from "./service/cart.service";
import { addressApi } from "./service/address.service";
import { imageApi } from "./service/image.service";
import { productApi } from "./service/product.service";
import { categoryApi } from "./service/category.service";
import { saleApi } from "./service/sale.service";
import { commentApi } from "./service/comment.service";
import { transportApi } from "./service/transport.service";
import { vnpayApi } from "./service/vnpay.service";
import { orderApi } from "./service/order.service";
import { authGoogleApi } from "./service/authGoogle.service";
import { roomChatApi } from "./service/roomChat.service";
import { smsOtpApi } from "./service/sms.service";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (gDM) =>
    gDM({
      immutableCheck: false,
      serializableCheck: false,
    }).concat([
      userApi.middleware,
      authApi.middleware,
      otpApi.middleware,
      cartApi.middleware,
      addressApi.middleware,
      imageApi.middleware,
      productApi.middleware,
      categoryApi.middleware,
      saleApi.middleware,
      commentApi.middleware,
      transportApi.middleware,
      vnpayApi.middleware,
      orderApi.middleware,
      authGoogleApi.middleware,
      roomChatApi.middleware,
      smsOtpApi.middleware,
    ]),
});

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
