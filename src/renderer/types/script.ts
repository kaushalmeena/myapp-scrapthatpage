import { SmallOperation } from "../../common/types/smallOperation";

export type Script = {
  id?: number;
  // Schema version stamped by the database layer (see database/schema.ts).
  version?: number;
  favorite: number;
  name: string;
  description: string;
  operations: SmallOperation[];
};
