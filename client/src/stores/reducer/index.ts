import { combineReducers } from "@reduxjs/toolkit";
import { userApi } from "../service/user.service";
import authSlice from "./authReducer";
import { authApi } from "../service/auth.service";
import { otpApi } from "../service/otp.service";
import cartSlice from "./cartReducer";
import { cartApi } from "../service/cart.service";
import { addressApi } from "../service/address.service";
import { imageApi } from "../service/image.service";
import { productApi } from "../service/product.service";
import { categoryApi } from "../service/category.service";
import { saleApi } from "../service/sale.service";

const rootReducer = combineReducers({
  [userApi.reducerPath]: userApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [otpApi.reducerPath]: otpApi.reducer,
  [cartApi.reducerPath]: cartApi.reducer,
  [addressApi.reducerPath]: addressApi.reducer,
  [imageApi.reducerPath]: imageApi.reducer,
  [productApi.reducerPath]: productApi.reducer,
  [categoryApi.reducerPath]: categoryApi.reducer,
  [saleApi.reducerPath]: saleApi.reducer,
  authSlice: authSlice,
  cartSlice: cartSlice,
});

export default rootReducer;
