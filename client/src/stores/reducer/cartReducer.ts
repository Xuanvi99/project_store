import { ICart, ICartItem } from "@/types/cart.type";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IPayload {
  cart?: ICart | null;
  selectProductCart?: {
    id: string;
    listProduct: ICartItem[];
    totalPrice: number;
  } | null;
}

const initialState: IPayload = {
  cart: null,
  selectProductCart: null,
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
