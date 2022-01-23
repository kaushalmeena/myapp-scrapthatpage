export const enum VALIDATION_TYPES {
  REQUIRED = 0,
  URL = 1
}

export const URL_RE = new RegExp(
  "^((http|https)://)(www.)?[-A-Za-z0-9+&@#/%?=~_|!:,.;{}]+[-A-Za-z0-9+&@#/%=~_|{}]$"
);

export const VALIDATION_FUNCTION = [
  function validate(value: string): boolean {
    return value.length > 0;
  },
  function validate(value: string): boolean {
    return URL_RE.test(value);
  }
];
