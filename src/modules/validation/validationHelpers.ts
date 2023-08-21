import { createElement } from '../helpers/functions';

export const getDateFromString = (dateString: string): Date => {
  return new Date(dateString.replace(/(\d+).(\d+).(\d+)/, '$3/$2/$1'));
};

export const getDateISOStringWithoutTime = (date: Date): string => {
  const ISOstring = date.toISOString();
  return ISOstring.slice(0, ISOstring.indexOf('T'));
};

export const getAgeFromDateString = (dateString: string): number => {
  const currentDate = new Date();
  const currentDateWithoutTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  const dateOfBirth = getDateFromString(dateString);
  const birthdayInThisYear = new Date(
    currentDateWithoutTime.getFullYear(),
    dateOfBirth.getMonth(),
    dateOfBirth.getDate(),
  );

  let age = currentDateWithoutTime.getFullYear() - dateOfBirth.getFullYear();

  if (currentDateWithoutTime < birthdayInThisYear) {
    age -= 1;
  }
  return age;
};

export const removeError = (formElement: HTMLElement): void => {
  const parent: HTMLElement | null = formElement.closest('.form-item');
  if (parent && parent.classList.contains('form-item--error')) {
    parent.classList.remove('form-item--error');
    parent.querySelector('.error-label')?.remove();
  }
};

export const removeHelp = (formElement: HTMLElement): void => {
  const parent: HTMLElement | null = formElement.closest('.form-item');
  if (parent && parent.classList.contains('form-item--help')) {
    parent.classList.remove('form-item--help');
    parent.querySelector('.help-label')?.remove();
  }
};

export const createError = (formElement: HTMLElement, text: string): void => {
  removeHelp(formElement);
  removeError(formElement);
  const parent: HTMLElement | null = formElement.closest('.form-item');
  if (parent) {
    parent.classList.add('form-item--error');
    createElement({
      tagName: 'label',
      classNames: ['error-label'],
      text,
      parent,
    });
  }
};

export const createHelp = (formElement: HTMLElement, text: string): void => {
  removeError(formElement);
  removeHelp(formElement);
  const parent: HTMLElement | null = formElement.closest('.form-item');
  if (parent) {
    parent.classList.add('form-item--help');
    createElement({
      tagName: 'label',
      classNames: ['help-label'],
      text,
      parent,
    });
  }
};
