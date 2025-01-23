import useClickOutSide from "./useClickOutSide";
import useToggle from "./useToggle";
import useHover from "./useHover";

export { useToggle, useClickOutSide, useHover };

import { AppDispatch, RootState } from "@/stores";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useSelectorChatSlice = () => {
  return useAppSelector((state: RootState) => state.chatSlice);
};

export const useSelectorAuthSlice = () => {
  return useAppSelector((state: RootState) => state.authSlice);
};

export const useSelectorCartSlice = () => {
  return useAppSelector((state: RootState) => state.cartSlice);
};
