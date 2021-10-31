import { SmallOperation } from "./smallOperation";

export type Script = {
  id: string;
  name: string;
  description: string;
  operations: SmallOperation[];
};
