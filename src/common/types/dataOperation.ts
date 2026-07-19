import { z } from "zod";

/**
 * "Data" operations are the compact form of a script action: just the input
 * type and value(s), with no editor metadata. This is what gets persisted to
 * the database and fed to the runner. Its rich counterpart used while editing
 * is the "Form" operation (see formOperation.ts).
 *
 * The zod schema below is the single source of truth: it validates records at
 * the database boundary, and the TypeScript types are derived from it with
 * `z.infer`, so the two can never drift out of sync.
 */

const dataTextInputSchema = z.object({
  type: z.literal("text"),
  value: z.string()
});

const dataSelectInputSchema = z.object({
  type: z.literal("select"),
  value: z.string()
});

const dataBlockInputSchema = z.object({
  type: z.literal("block"),
  // Recursive: a block holds nested steps. The getter defers evaluation until
  // dataOperationSchema is defined below.
  get steps() {
    return z.array(dataOperationSchema);
  }
});

/** Runtime schema and single source of truth for a stored operation. */
export const dataOperationSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("open"),
    inputs: z.tuple([dataTextInputSchema])
  }),
  z.object({
    type: z.literal("extract"),
    inputs: z.tuple([
      dataTextInputSchema,
      dataTextInputSchema,
      dataSelectInputSchema
    ])
  }),
  z.object({
    type: z.literal("click"),
    inputs: z.tuple([dataTextInputSchema])
  }),
  z.object({
    type: z.literal("type"),
    inputs: z.tuple([dataTextInputSchema, dataTextInputSchema])
  }),
  z.object({
    type: z.literal("set"),
    inputs: z.tuple([
      dataTextInputSchema,
      dataSelectInputSchema,
      dataTextInputSchema
    ])
  }),
  z.object({
    type: z.literal("increase"),
    inputs: z.tuple([dataTextInputSchema, dataTextInputSchema])
  }),
  z.object({
    type: z.literal("decrease"),
    inputs: z.tuple([dataTextInputSchema, dataTextInputSchema])
  }),
  z.object({
    type: z.literal("if"),
    inputs: z.tuple([dataTextInputSchema, dataBlockInputSchema])
  }),
  z.object({
    type: z.literal("while"),
    inputs: z.tuple([dataTextInputSchema, dataBlockInputSchema])
  }),
  z.object({
    type: z.literal("wait"),
    inputs: z.tuple([dataTextInputSchema, dataTextInputSchema])
  }),
  z.object({
    type: z.literal("delay"),
    inputs: z.tuple([dataTextInputSchema])
  }),
  z.object({
    type: z.literal("scroll"),
    inputs: z.tuple([dataTextInputSchema])
  })
]);

export type DataTextInput = z.infer<typeof dataTextInputSchema>;
export type DataSelectInput = z.infer<typeof dataSelectInputSchema>;
export type DataBlockInput = z.infer<typeof dataBlockInputSchema>;
export type DataInput = DataTextInput | DataSelectInput | DataBlockInput;
export type DataOperation = z.infer<typeof dataOperationSchema>;
