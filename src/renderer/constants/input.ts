export enum VALIDATION_TYPES {
  REQUIRED,
  URL,
  EMAIL
}

export enum INPUT_TYPES {
  TEXT,
  TEXTAREA
}

export const VALIDATION_REGEXES = [
  new RegExp(".+"),
  new RegExp(
    "^(http://www.|https://www.|http://|https://)?[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$"
  )
];
