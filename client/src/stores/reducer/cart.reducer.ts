import { ICart } from "@/types/cart.type";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IPayload {
  cart: ICart | null;
}

const initialState: IPayload = {
  cart: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    updateCart: (state, action: PayloadAction<IPayload>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { updateCart } = cartSlice.actions;

export default cartSlice.reducer;
