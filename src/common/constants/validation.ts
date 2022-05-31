export const enum ValidationTypes {
  REQUIRED = 0,
  URL = 1
}

export const URL_RE =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;

export const VALIDATION_FUNCTION = [
  function validate(value: string): boolean {
    return value.length > 0;
  },
  function validate(value: string): boolean {
    return URL_RE.test(value);
  }
];
