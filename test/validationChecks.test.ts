import {
  hasLSpaces,
  hasLetters,
  hasLowerLetters,
  hasNumbers,
  hasNumbersAndDots,
  hasTSpaces,
  hasUpperLetters,
  isDateFormat,
  isEmailFormat,
  isLessLengthLimit,
  isLessMinAge,
  isMaxLength,
  isOnlyNumbers,
  isOverMaxLength,
  isOverMinAge,
  isOverOrEqualMaxLength,
  isPasswordFormat,
} from '../src/modules/validation/validationChecks';

describe('validation checks functions', () => {
  const testString = ' TestString';
  const testStringWithNumbers = 'String1';
  const testDateString = '20.01.2001';
  const testNumbersString = '1234';
  const testPasswordString = 'Password1234';
  const testEmail = 'email@mail.ru';
  const minAge = 16;
  const lengthLimit = 7;

  test('has leading spaces function', () => {
    expect(hasLSpaces(testString)).toBeTruthy();
  });

  test('has trailing spaces function', () => {
    expect(hasTSpaces(testString)).toBeFalsy();
  });

  test('has numbers function', () => {
    expect(hasNumbers(testStringWithNumbers)).toBeTruthy();
    expect(hasNumbers(testString)).toBeFalsy();
  });

  test('has letters function', () => {
    expect(hasLetters(testString)).toBeTruthy();
    expect(hasLetters(testNumbersString)).toBeFalsy();
  });

  test('has lowerLetters function', () => {
    expect(hasLowerLetters(testString)).toBeTruthy();
    expect(hasLowerLetters(testNumbersString)).toBeFalsy();
  });

  test('has upperLetters function', () => {
    expect(hasUpperLetters(testString)).toBeTruthy();
  });

  test('has numbers and dots function', () => {
    expect(hasNumbersAndDots(testDateString)).toBeTruthy();
    expect(hasNumbersAndDots(testString)).toBeFalsy();
  });

  test('has only numbers function', () => {
    expect(isOnlyNumbers(testNumbersString)).toBeTruthy();
    expect(isOnlyNumbers(testString)).toBeFalsy();
  });

  test('is date format function', () => {
    expect(isDateFormat(testDateString)).toBeTruthy();
    expect(isDateFormat(testNumbersString)).toBeFalsy();
  });

  test('is password format function', () => {
    expect(isPasswordFormat(testPasswordString)).toBeTruthy();
    expect(isPasswordFormat(testStringWithNumbers)).toBeFalsy();
  });

  test('is email format function', () => {
    expect(isEmailFormat(testEmail)).toBeTruthy();
    expect(isEmailFormat(testString)).toBeFalsy();
  });

  test('is over min age function', () => {
    expect(isOverMinAge(testDateString, minAge)).toBeTruthy();
  });

  test('is less min age function', () => {
    expect(isLessMinAge(testDateString, minAge)).toBeFalsy();
  });

  test('is less length limit function', () => {
    expect(isLessLengthLimit(testStringWithNumbers, lengthLimit)).toBeFalsy();
  });

  test('is max length function', () => {
    expect(isMaxLength(testStringWithNumbers, lengthLimit)).toBeTruthy();
  });

  test('is over length limit function', () => {
    expect(isOverMaxLength(testStringWithNumbers, lengthLimit)).toBeFalsy();
  });

  test('is over or equial max length', () => {
    expect(isOverOrEqualMaxLength(testStringWithNumbers, lengthLimit)).toBeTruthy();
  });
});
