import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { StoreRootState, StoreRootDispatch } from "../types/store";

export const useAppDispatch = () => useDispatch<StoreRootDispatch>();

export const useAppSelector: TypedUseSelectorHook<StoreRootState> = useSelector;
