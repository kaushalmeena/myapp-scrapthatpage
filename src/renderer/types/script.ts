import type { DataOperation } from "../../common/types/dataOperation";

export type Script = {
  id?: number;
  // Schema version stamped by the database layer (see database/schema.ts).
  version?: number;
  favorite: boolean;
  name: string;
  description: string;
  operations: DataOperation[];
};
