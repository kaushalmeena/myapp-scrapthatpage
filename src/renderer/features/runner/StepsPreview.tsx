import { Card } from "@/components/ui/card";
import { OPERATION_ICONS } from "@/features/editor/operationIcons";
import { LARGE_OPERATIONS } from "../../../common/constants/largeOperations";
import type { SmallOperation } from "../../../common/types/smallOperation";
import {
  hasAnyInputValue,
  replaceFormatWithInputs
} from "../../../common/utils/operation";

// Template lookup: stored operations only keep { type, inputs }, so the
// display name/format comes from the operation catalog.
const templateFor = (type: SmallOperation["type"]) =>
  LARGE_OPERATIONS.find((operation) => operation.type === type);

// Widened view of inputs: each operation type carries a specific tuple, so a
// direct `input.type === "operation_box"` check doesn't type-check across the
// whole SmallOperation union.
const nestedStepCount = (operation: SmallOperation): number => {
  const inputs = operation.inputs as ReadonlyArray<{
    type: string;
    operations?: SmallOperation[];
  }>;
  let count = 0;
  for (const input of inputs) {
    if (input.type === "operation_box" && input.operations) {
      count += input.operations.length;
    }
  }
  return count;
};

// Read-only outline of what a run will do, shown before the first run so the
// user can sanity-check the script without opening the editor.
export default function StepsPreview({
  operations
}: {
  operations: SmallOperation[];
}) {
  return (
    <Card className="gap-0 overflow-hidden p-0">
      <div className="border-b px-4 py-2.5">
        <h2 className="text-sm font-semibold">
          What this run will do
          <span className="ml-2 font-normal text-muted-foreground">
            {operations.length} {operations.length === 1 ? "step" : "steps"}
          </span>
        </h2>
      </div>
      <div className="flex flex-col p-1.5">
        {operations.map((operation, index) => {
          const template = templateFor(operation.type);
          if (!template) {
            return null;
          }
          const Icon = OPERATION_ICONS[operation.type];
          const detail = hasAnyInputValue(operation.inputs)
            ? replaceFormatWithInputs(template.format, operation.inputs)
            : template.description;
          const nested = nestedStepCount(operation);
          return (
            <div
              key={`preview-${index}`}
              className="flex items-center gap-3 rounded-md px-2.5 py-2"
            >
              <span className="w-5 text-right text-xs text-muted-foreground tabular-nums">
                {index + 1}
              </span>
              <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">
                  {template.name}
                  {nested > 0 && (
                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                      {nested} nested {nested === 1 ? "step" : "steps"}
                    </span>
                  )}
                </span>
                <span
                  className="block truncate text-xs text-muted-foreground"
                  title={detail}
                >
                  {detail}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
