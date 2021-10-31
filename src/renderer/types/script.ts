import { SmallOperation } from "./smallOperation";

export type Script = {
  id?: number;
  favourite: number;
  name: string;
  description: string;
  operations: SmallOperation[];
};
