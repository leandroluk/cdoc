export const REGEX = {
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).+$/,
  ALIAS: /^[a-z0-9]+(-[a-z0-9]+)*$|^.{5,50}$/,
};
