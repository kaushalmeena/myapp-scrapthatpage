import type { StoredOperation } from "../../common/types/storedOperation";

export type Script = {
  id?: number;
  // Schema version stamped by the database layer (see database/schema.ts).
  version?: number;
  favorite: boolean;
  name: string;
  description: string;
  operations: StoredOperation[];
};
