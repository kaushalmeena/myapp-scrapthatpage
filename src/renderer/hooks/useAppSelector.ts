import { TypedUseSelectorHook, useSelector } from "react-redux";
import { StoreRootState } from "../types/store";

export const useAppSelector: TypedUseSelectorHook<StoreRootState> = useSelector;
