import { useContext } from "react";
import { SnackbarContext } from "../context/Snackbar";
import { SnackbarInterface } from "../types/snackbar";

export const useSnackbar = (): SnackbarInterface => useContext(SnackbarContext);
