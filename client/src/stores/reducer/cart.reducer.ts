import { ICart } from "@/types/cart.type";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface IPayloadCart {
  cart: ICart | null;
}

const initialState: IPayloadCart = {
  cart: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    updateCart: (state, action: PayloadAction<IPayloadCart>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { updateCart } = cartSlice.actions;

export default cartSlice.reducer;
