import useClickOutSide from "./useClickOutSide";
import useToggle from "./useToggle";
import useHover from "./useHover";

export { useToggle, useClickOutSide, useHover };

import { AppDispatch, RootState } from "../stores";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
