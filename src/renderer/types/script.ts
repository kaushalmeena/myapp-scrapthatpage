import { SmallOperation } from "./smallOperation";

export type Script = {
  id?: number;
  favorite: number;
  name: string;
  description: string;
  operations: SmallOperation[];
};
