import { useDispatch } from "react-redux";
import { StoreRootDispatch } from "../types/store";

export const useAppDispatch = () => useDispatch<StoreRootDispatch>();
