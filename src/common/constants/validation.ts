export enum VALIDATION_TYPES {
  REQUIRED,
  URL
}

export const URL_REGEX = new RegExp(
  "^(http://www.|https://www.|http://|https://)?[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$"
);

export const VALIDATION_FUNCTION = [
  function validate(value: string): boolean {
    return value.length > 0;
  },
  function validate(value: string): boolean {
    return URL_REGEX.test(value);
  }
];
