import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { redo, undo } from "../scriptEditorSlice";

// Standard editor shortcuts: Cmd/Ctrl+Z undoes, Shift+Cmd/Ctrl+Z redoes.
// Skipped while focus is in a text field so native text undo still works.
export const useUndoRedoShortcuts = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        !(event.metaKey || event.ctrlKey) ||
        event.key.toLowerCase() !== "z"
      ) {
        return;
      }
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA")
      ) {
        return;
      }
      event.preventDefault();
      dispatch(event.shiftKey ? redo() : undo());
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [dispatch]);
};
