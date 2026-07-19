import { z } from "zod";
import type { Script } from "@/types/script";
import type { StoredOperation } from "../../common/types/storedOperation";

// Version stamped onto every script written to IndexedDB. Bump it (and add a
// migration to `parseStoredScript`) whenever the stored shape changes.
export const SCRIPT_SCHEMA_VERSION = 1;

const textInputSchema = z.object({
  type: z.literal("text"),
  value: z.string()
});

const selectInputSchema = z.object({
  type: z.literal("select"),
  value: z.string()
});

const operationBoxInputSchema = z.object({
  type: z.literal("operation_box"),
  get operations() {
    return z.array(storedOperationSchema);
  }
});

const storedOperationSchemaInternal = z.discriminatedUnion("type", [
  z.object({ type: z.literal("open"), inputs: z.tuple([textInputSchema]) }),
  z.object({
    type: z.literal("extract"),
    inputs: z.tuple([textInputSchema, textInputSchema, selectInputSchema])
  }),
  z.object({ type: z.literal("click"), inputs: z.tuple([textInputSchema]) }),
  z.object({
    type: z.literal("type"),
    inputs: z.tuple([textInputSchema, textInputSchema])
  }),
  z.object({
    type: z.literal("set"),
    inputs: z.tuple([textInputSchema, selectInputSchema, textInputSchema])
  }),
  z.object({
    type: z.literal("increase"),
    inputs: z.tuple([textInputSchema, textInputSchema])
  }),
  z.object({
    type: z.literal("decrease"),
    inputs: z.tuple([textInputSchema, textInputSchema])
  }),
  z.object({
    type: z.literal("if"),
    inputs: z.tuple([textInputSchema, operationBoxInputSchema])
  }),
  z.object({
    type: z.literal("while"),
    inputs: z.tuple([textInputSchema, operationBoxInputSchema])
  }),
  z.object({
    type: z.literal("wait"),
    inputs: z.tuple([textInputSchema, textInputSchema])
  }),
  z.object({
    type: z.literal("delay"),
    inputs: z.tuple([textInputSchema])
  }),
  z.object({
    type: z.literal("scroll"),
    inputs: z.tuple([textInputSchema])
  })
]);

// Compile-time lockstep check: every member of the StoredOperation union must
// be accepted by the schema, so adding a new operation type without updating
// the schema stops compiling. (The reverse check isn't expressible because
// zod v4 infers tuples with optional/rest elements; exactness of each tuple is
// still enforced at runtime and covered by tests.)
true satisfies StoredOperation extends z.infer<
  typeof storedOperationSchemaInternal
>
  ? true
  : false;

export const storedOperationSchema =
  storedOperationSchemaInternal as unknown as z.ZodType<
    StoredOperation,
    StoredOperation
  >;

// Typed as ZodType<Script, Script> so the hand-written TS types remain the
// single source of truth and this schema is checked against them.
export const scriptSchema: z.ZodType<Script, Script> = z.object({
  id: z.number().optional(),
  version: z.number().optional(),
  favorite: z.boolean(),
  name: z.string().min(1),
  description: z.string(),
  operations: z.array(storedOperationSchema)
});

// Validates a record read from IndexedDB. Version-based migrations go here as
// the stored shape evolves. Returns null for records that are unreadable, so
// callers can skip them instead of crashing the whole list.
export const parseStoredScript = (raw: unknown): Script | null => {
  const result = scriptSchema.safeParse(raw);
  if (!result.success) {
    console.warn("Skipping invalid stored script:", result.error.message);
    return null;
  }
  return result.data;
};

// Validates a script before it is written, stamping the current version.
// Throws on invalid data so bugs surface at the write site, not on read.
export const prepareScriptForWrite = (script: Script): Script => ({
  ...scriptSchema.parse(script),
  version: SCRIPT_SCHEMA_VERSION
});
