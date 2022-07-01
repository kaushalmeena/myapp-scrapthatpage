import { ValidationFunction } from "../types/validation";

export const enum ValidationTypes {
  REQUIRED = "REQUIRED",
  URL = "URL"
}

export const URL_RE =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;

export const VALIDATION_FUNCTION: ValidationFunction = {
  [ValidationTypes.REQUIRED]: (value) => value.length > 0,
  [ValidationTypes.URL]: (value) => URL_RE.test(value)
};
