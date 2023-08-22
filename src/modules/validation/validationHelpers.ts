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

export const removeLabelBlock = (formElement: HTMLElement, classNames: string[]): void => {
  const parent: HTMLElement | null = formElement.closest('.form-item');
  if (parent && parent.classList.contains(classNames[0])) {
    parent.classList.remove(classNames[0]);
    parent.querySelector(classNames[1])?.remove();
  }
};

export const removeError = (formElement: HTMLElement): void => {
  removeLabelBlock(formElement, ['form-item--error', '.error-label']);
};

export const removeHelp = (formElement: HTMLElement): void => {
  removeLabelBlock(formElement, ['form-item--help', '.help-label']);
};

export const createLabelBlock = (formElement: HTMLElement, text: string, classNames: string[]): void => {
  removeHelp(formElement);
  removeError(formElement);
  const parent: HTMLElement | null = formElement.closest('.form-item');
  if (parent) {
    parent.classList.add(classNames[0]);
    createElement({
      tagName: 'label',
      classNames: [classNames[1]],
      text,
      parent,
    });
  }
};

export const createError = (formElement: HTMLElement, text: string): void => {
  createLabelBlock(formElement, text, ['form-item--error', 'error-label']);
};

export const createHelp = (formElement: HTMLElement, text: string): void => {
  createLabelBlock(formElement, text, ['form-item--help', 'help-label']);
};
