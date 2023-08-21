export const letters = /^[A-Za-zА-Яа-яЁё\s]+$/;
export const lowerLetters = /[a-z-а-яё]/;
export const upperLetters = /[A-Z-А-Я-Ё]/;
export const leadingSpaces = /^\s+.*/;
export const trailingSpaces = /.*\s+$/;
export const numbers = /[0-9]/;
export const onlyNumbers = /^[0-9]+$/;
export const numbersAndDots = /^(?=.*\d)(\d*\.?){0,}\d*$/;
export const lettersAndNumbers = /^[0-9a-zA-Z\s]+$/;
export const passwordFormat = /^(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*/;
export const emailFormat =
  /^((([0-9A-Za-z]{1}[-0-9A-z.]{1,}[0-9A-Za-z]{1})|([0-9А-Яа-я]{1}[-0-9А-я.]{1,}[0-9А-Яа-я]{1}))@([-A-Za-z]{1,}\.){1,2}[-A-Za-z]{2,})$/;
export const dateFormat = /(?:0?[1-9]|[12][0-9]|3[0-1])\.(?:0?[1-9]|1[0-2])\.(?:19[0-9][0-9]|20[01][0-9]|20[02][0-3])/;
