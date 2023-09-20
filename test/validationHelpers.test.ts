import {
  getDateDMYFormatFromIsoString,
  getDateFromString,
  getDateISOStringWithoutTime,
} from '../src/modules/validation/validationHelpers';

describe('validation checks functions', () => {
  const testDateString = '20.01.2001';
  const testDate = new Date('2001-01-20T00:00:00.000Z');
  const dateISOStringWithoutTime = '2001-01-20';

  test('get date from string function', () => {
    expect(getDateFromString(testDateString)).toStrictEqual(testDate);
    expect(getDateFromString(testDateString)).not.toStrictEqual(new Date());
  });

  test('get date iso string without time function', () => {
    expect(getDateISOStringWithoutTime(testDate)).toStrictEqual(dateISOStringWithoutTime);
  });

  test('get date DMY format from ISO string function', () => {
    expect(getDateDMYFormatFromIsoString(dateISOStringWithoutTime)).toStrictEqual(testDateString);
  });
});
