import {
  dateFormat,
  emailFormat,
  letters,
  lowerLetters,
  numbers,
  numbersAndDots,
  passwordFormat,
  upperLetters,
} from './regExpVariables';
import { getAgeFromDateString } from './validationHelpers';

export const hasNumbers = (string: string): boolean => Boolean(string.match(numbers));

export const hasLetters = (string: string): boolean => Boolean(string.match(letters));

export const hasLowerLetters = (string: string): boolean => Boolean(string.match(lowerLetters));

export const hasUpperLetters = (string: string): boolean => Boolean(string.match(upperLetters));

export const hasNumbersAndDots = (string: string): boolean => Boolean(string.match(numbersAndDots));

export const isDateFormat = (string: string): boolean => Boolean(string.match(dateFormat));
export const dateFormatLength = 10;

export const isPasswordFormat = (string: string): boolean => Boolean(string.match(passwordFormat));
export const passwordFormatLength = 8;

export const isEmailFormat = (string: string): boolean => Boolean(string.match(emailFormat));

export const isOverMinAge = (string: string, minAge: number): boolean => Boolean(getAgeFromDateString(string) > minAge);

export const isLessMinAge = (string: string, minAge: number): boolean => Boolean(getAgeFromDateString(string) < minAge);

export const isWithinLengthLimit = (string: string, maxLength: number): boolean =>
  Boolean(string.length > 0 && string.length < maxLength);

export const isLessLengthLimit = (string: string, maxLength: number): boolean =>
  Boolean(string.length > 0 && string.length < maxLength);

export const isMaxLength = (string: string, maxLength: number): boolean => Boolean(string.length === maxLength);

export const isOverMaxLength = (string: string, maxLength: number): boolean => Boolean(string.length > maxLength);
