import { z } from "zod";

/**
 * An operation is one action in a script — the compact, canonical form: just
 * the input type and value(s), with no editor metadata. This is what gets
 * persisted to the database, fed to the runner, and held (per node) by the
 * editor. The static per-type editor metadata (labels, layout, validation,
 * picker config) lives separately in OPERATION_SCHEMA (see operationSchema.ts).
 *
 * The zod schema below (z-prefixed) is the single source of truth: it validates
 * records at the database boundary, and the TypeScript types are derived from
 * it with `z.infer`, so the two can never drift out of sync.
 */

const zTextInput = z.object({
  type: z.literal("text"),
  value: z.string()
});

const zSelectInput = z.object({
  type: z.literal("select"),
  value: z.string()
});

const zBlockInput = z.object({
  type: z.literal("block"),
  // Recursive: a block holds nested steps. The getter defers evaluation until
  // zOperation is defined below.
  get steps() {
    return z.array(zOperation);
  }
});

/** Runtime schema and single source of truth for an operation. */
export const zOperation = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("open"),
    inputs: z.tuple([zTextInput])
  }),
  z.object({
    type: z.literal("extract"),
    inputs: z.tuple([zTextInput, zTextInput, zSelectInput])
  }),
  z.object({
    type: z.literal("click"),
    inputs: z.tuple([zTextInput])
  }),
  z.object({
    type: z.literal("type"),
    inputs: z.tuple([zTextInput, zTextInput])
  }),
  z.object({
    type: z.literal("set"),
    inputs: z.tuple([zTextInput, zSelectInput, zTextInput])
  }),
  z.object({
    type: z.literal("increase"),
    inputs: z.tuple([zTextInput, zTextInput])
  }),
  z.object({
    type: z.literal("decrease"),
    inputs: z.tuple([zTextInput, zTextInput])
  }),
  z.object({
    type: z.literal("if"),
    inputs: z.tuple([zTextInput, zBlockInput])
  }),
  z.object({
    type: z.literal("while"),
    inputs: z.tuple([zTextInput, zBlockInput])
  }),
  z.object({
    type: z.literal("wait"),
    inputs: z.tuple([zTextInput, zTextInput])
  }),
  z.object({
    type: z.literal("delay"),
    inputs: z.tuple([zTextInput])
  }),
  z.object({
    type: z.literal("scroll"),
    inputs: z.tuple([zTextInput])
  })
]);

export type TextInput = z.infer<typeof zTextInput>;
export type SelectInput = z.infer<typeof zSelectInput>;
export type BlockInput = z.infer<typeof zBlockInput>;
export type Input = TextInput | SelectInput | BlockInput;
export type Operation = z.infer<typeof zOperation>;
export type OperationType = Operation["type"];
