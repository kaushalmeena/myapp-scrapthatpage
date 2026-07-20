import { OPERATION_SCHEMA } from "@common/constants/operationSchema";
import { useEditorStore } from "../editorStore";
import OperationPanel from "./OperationPanel";
import SelectInput from "./SelectInput";
import TextInput from "./TextInput";

// Renders one operation input by its schema type: a text field (with
// variable/element pickers), a select, or a nested operation list. The value
// and error come from the normalized editor node; the labels, options and
// picker config come from OPERATION_SCHEMA (looked up by operation type).
export default function OperationInput({
  operationId,
  inputIndex,
  numberPrefix
}: {
  operationId: string;
  inputIndex: number;
  // Number prefix for nested operation lists rendered by block inputs.
  numberPrefix: string;
}) {
  // Selecting type and input separately keeps this component from re-rendering
  // when a sibling input in the same operation changes.
  const type = useEditorStore((s) => s.operations[operationId]?.type);
  const input = useEditorStore(
    (s) => s.operations[operationId]?.inputs[inputIndex]
  );

  if (!type || !input) {
    return null;
  }

  const inputSchema = OPERATION_SCHEMA[type].inputs[inputIndex];

  switch (inputSchema.type) {
    case "text":
      // input is a scalar here (node and schema are index-aligned); the guard
      // only narrows the union for the compiler.
      return input.type === "block" ? null : (
        <TextInput
          operationId={operationId}
          inputIndex={inputIndex}
          value={input.value}
          error={input.error}
          schema={inputSchema}
        />
      );
    case "select":
      return input.type === "block" ? null : (
        <SelectInput
          operationId={operationId}
          inputIndex={inputIndex}
          value={input.value}
          error={input.error}
          schema={inputSchema}
        />
      );
    case "block":
      return (
        <OperationPanel
          listRef={{ parentId: operationId, inputIndex }}
          numberPrefix={numberPrefix}
        />
      );
  }
}
