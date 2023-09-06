import { clearLS, getFromLS, parseLS, removeFromLS, setToLS, stringifyLS } from '../src/modules/helpers/functions';

const localStorageMock = (function LSMfunction(): Partial<Storage> {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string): string | null => store[key],
    setItem: (key: string, value: string): void => {
      store[key] = value.toString();
    },
    clear: (): void => {
      store = {};
    },
    removeItem: (key: string): void => {
      delete store[key];
    },
  };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

const htmlMock = '<button class="help">?</button>';

describe('local storage functions', () => {
  beforeEach((): void => {
    localStorage.clear();
  });

  test('check getFromLS function', () => {
    const item = '111';
    const value = 'value';
    localStorage.setItem(item, value);
    const data: string | null = getFromLS(item);
    expect(data).toStrictEqual(value);
  });

  test('check setToLS function', () => {
    const item = '222';
    const value = 'value';
    setToLS(item, value);
    expect(localStorage.getItem(item)).toStrictEqual(value);
  });

  test('check removeFromLS function', () => {
    const item = '333';
    const value = 'value';
    localStorage.setItem(item, value);
    removeFromLS(item);
    expect(localStorage.getItem(item)).toBeUndefined();
  });

  test('check clearLS function', () => {
    const item = '444';
    const value = 'value';
    localStorage.setItem(item, value);
    clearLS();
    expect(localStorage.getItem(item)).toBeUndefined();
  });

  test('check stringify function', () => {
    const item: number[] = [1, 3];
    const result = stringifyLS(item);
    expect(item).toStrictEqual(JSON.parse(result));
  });

  test('check parse function', () => {
    const item = '[2,5]';
    const result = parseLS(item);
    expect(item).toStrictEqual(JSON.stringify(result));
  });
});
