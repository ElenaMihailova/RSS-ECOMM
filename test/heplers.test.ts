import { calculateQuantitySum, getCountryCode, getCountryFromCountryCode } from '../src/modules/helpers/functions';
import { CountryCodes, Countries } from '../src/types/enums';

describe('common helpers functions', () => {
  test('get country from counrty code function', () => {
    expect(getCountryFromCountryCode(CountryCodes.Belarus)).toStrictEqual(Countries.Belarus);
    expect(getCountryFromCountryCode(CountryCodes.Spain)).toStrictEqual(Countries.Spain);
    expect(getCountryFromCountryCode(CountryCodes.Netherlands)).toStrictEqual(Countries.Netherlands);
  });

  test('get country code from counrty function', () => {
    expect(getCountryCode(Countries.Belarus)).toStrictEqual(CountryCodes.Belarus);
    expect(getCountryCode(Countries.Spain)).toStrictEqual(CountryCodes.Spain);
    expect(getCountryCode(Countries.Netherlands)).toStrictEqual(CountryCodes.Netherlands);
  });

  const testQuantities = [1, 3, 5];

  test('get calculace quantity function', () => {
    expect(calculateQuantitySum(testQuantities)).toStrictEqual(9);
    expect(calculateQuantitySum([])).toStrictEqual(0);
  });
});
