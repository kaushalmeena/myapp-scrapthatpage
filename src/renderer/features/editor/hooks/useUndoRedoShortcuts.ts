import { useEffect } from "react";
import { useEditorStore } from "../store/editorStore";

// Standard editor shortcuts: Cmd/Ctrl+Z undoes, Shift+Cmd/Ctrl+Z redoes.
// Skipped while focus is in a text field so native text undo still works.
// Undo/redo are driven by zundo's temporal store.
export const useUndoRedoShortcuts = () => {
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
      const { undo, redo } = useEditorStore.temporal.getState();
      if (event.shiftKey) {
        redo();
      } else {
        undo();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);
};
