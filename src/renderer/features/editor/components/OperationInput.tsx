import { useAppSelector } from "@/hooks/useAppSelector";
import OperationSelectInput from "./OperationSelectInput";
import OperationsPanel from "./OperationsPanel";
import OperationTextInput from "./OperationTextInput";

// Renders one operation input by its type: a text field (with variable/element
// pickers), a select, or a nested operation list.
export default function OperationInput({
  operationId,
  inputIndex,
  numberPrefix
}: {
  operationId: string;
  inputIndex: number;
  // Number prefix for nested operation lists rendered by box inputs.
  numberPrefix: string;
}) {
  const input = useAppSelector(
    (s) => s.scriptEditor.operations[operationId]?.inputs[inputIndex]
  );

  if (!input) {
    return null;
  }

  switch (input.type) {
    case "text":
      return (
        <OperationTextInput
          operationId={operationId}
          inputIndex={inputIndex}
          input={input}
        />
      );
    case "select":
      return (
        <OperationSelectInput
          operationId={operationId}
          inputIndex={inputIndex}
          input={input}
        />
      );
    case "block":
      return (
        <OperationsPanel
          listRef={{ parentId: operationId, inputIndex }}
          numberPrefix={numberPrefix}
        />
      );
  }
}
