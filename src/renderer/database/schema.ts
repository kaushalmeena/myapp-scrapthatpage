import { z } from "zod";
import type { Script } from "@/types/script";
import { dataOperationSchema } from "../../common/types/dataOperation";

// Version stamped onto every script written to IndexedDB. Bump it (and add a
// migration to `parseStoredScript`) whenever the stored shape changes.
export const SCRIPT_SCHEMA_VERSION = 1;

// Typed as ZodType<Script, Script> so the hand-written Script type stays the
// single source of truth for the record shape and this schema is checked
// against it. (The operation shapes come from dataOperationSchema, which is
// itself the source of truth for the DataOperation types.)
export const scriptSchema: z.ZodType<Script, Script> = z.object({
  id: z.number().optional(),
  version: z.number().optional(),
  favorite: z.boolean(),
  name: z.string().min(1),
  description: z.string(),
  operations: z.array(dataOperationSchema)
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
