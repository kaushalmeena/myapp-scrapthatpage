import { OPERATION_SCHEMA } from "@common/constants/operationSchema";
import type { Operation } from "@common/types/operation";
import {
  hasAnyInputValue,
  replaceFormatWithInputs
} from "@common/utils/operation";
import { Card } from "@/components/ui/card";
import { OPERATION_ICONS } from "@/features/editor/constants/operationIcons";

// Widened view of inputs: each operation type carries a specific tuple, so a
// direct `input.type === "block"` check doesn't type-check across the
// whole Operation union.
const nestedStepCount = (operation: Operation): number => {
  const inputs = operation.inputs as ReadonlyArray<{
    type: string;
    steps?: Operation[];
  }>;
  let count = 0;
  for (const input of inputs) {
    if (input.type === "block" && input.steps) {
      count += input.steps.length;
    }
  }
  return count;
};

// Read-only outline of what a run will do, shown before the first run so the
// user can sanity-check the script without opening the editor.
export default function StepsPreview({
  operations
}: {
  operations: Operation[];
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
          const schema = OPERATION_SCHEMA[operation.type];
          const Icon = OPERATION_ICONS[operation.type];
          const detail = hasAnyInputValue(operation.inputs)
            ? replaceFormatWithInputs(schema.format, operation.inputs)
            : schema.description;
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
                  {schema.name}
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
