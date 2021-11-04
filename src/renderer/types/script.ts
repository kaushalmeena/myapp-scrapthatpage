import { SmallOperation } from "../../common/types/smallOperation";

export type Script = {
  id?: number;
  favorite: number;
  name: string;
  description: string;
  operations: SmallOperation[];
};
