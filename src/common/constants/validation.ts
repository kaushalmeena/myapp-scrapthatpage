import { ValidationFunction } from "../types/validation";

const URL_RE =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;

export const VALIDATION_FUNCTION: ValidationFunction = {
  required: (value) => value.length > 0,
  url: (value) => URL_RE.test(value)
};
