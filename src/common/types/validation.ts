export type ValidationType = "required" | "url";

export type ValidationRule = {
  type: ValidationType;
  message: string;
};

export type ValidationFunction = Record<
  ValidationType,
  (value: string) => boolean
>;
