import { Data } from '../types';
import { getElement, getElementCollection } from '../helpers/functions';
import { removeError, removeHelp, createError, createHelp } from './validationHelpers';
import {
  dateFormatLength,
  isDateFormat,
  isLessMinAge,
  isMaxLength,
  isOverMaxLength,
  hasLetters,
  hasNumbers,
  hasNumbersAndDots,
  isWithinLengthLimit,
  hasLowerLetters,
  hasUpperLetters,
  isEmailFormat,
  isLessLengthLimit,
  passwordFormatLength,
  hasLSpaces,
  hasTSpaces,
} from './validationChecks';

class Validator {
  private billingCountry: string | null;

  private shippingCountry: string | null;

  private currentValidateCountry: string | null;

  private postalCodeLength: number | null;

  private readonly minAge = 16;

  constructor() {
    this.postalCodeLength = null;
    this.billingCountry = null;
    this.shippingCountry = null;
    this.currentValidateCountry = null;
  }

  public removeLabels(element: HTMLInputElement): void {
    removeHelp(element);
    removeError(element);
  }

  public validateRealTime(element: HTMLInputElement): void {
    this.removeLabels(element);
    const { value } = element;
    const loginBtn = getElement('.login__button');

    if (value) {
      switch (element.dataset.type) {
        case 'name':
        case 'surname':
        case 'city':
          if (!hasLetters(value)) {
            createError(element, 'This field must not contain special characters or numbers');
          }
          break;
        case 'age':
          createHelp(element, 'Please enter your date of birth in the format: DD.MM.YYYY');

          if (!hasNumbersAndDots(value)) {
            createError(element, 'You should enter only numbers and dots');
          } else if (isMaxLength(value, dateFormatLength) && !isDateFormat(value)) {
            createError(element, 'Invalid data!');
          } else if (isMaxLength(value, dateFormatLength) && isDateFormat(value) && isLessMinAge(value, this.minAge)) {
            createError(element, `User must be at least ${this.minAge} years old`);
          } else if (isOverMaxLength(value, dateFormatLength)) {
            createError(element, 'The date does not match the required format. Too many characters');
          }

          break;
        case 'email':
          if (!isEmailFormat(value)) {
            createError(element, 'Incorrect email address!');
            loginBtn.setAttribute('disabled', 'disabled');
          } else {
            loginBtn.removeAttribute('disabled');
          }
          break;
        case 'login-password':
          if (
            isWithinLengthLimit(value, passwordFormatLength) ||
            hasLSpaces(value) ||
            hasTSpaces(value) ||
            !hasLowerLetters(value) ||
            !hasNumbers(value) ||
            !hasUpperLetters(value)
          ) {
            createError(
              element,
              'Password must be at least 8 characters long, must contain at least one uppercase letter, must contain at least one lowercase letter, must contain at least one digit, must not contain leading or trailing whitespace',
            );
            loginBtn.setAttribute('disabled', 'disabled');
          } else {
            loginBtn.removeAttribute('disabled');
          }
          break;
        case 'postal-code':
          if (element.classList.contains('billing-adress__input')) {
            this.currentValidateCountry = this.billingCountry;
          } else if (element.classList.contains('shipping-adress__input')) {
            this.currentValidateCountry = this.shippingCountry;
          }

          if (!hasNumbers(value)) {
            removeError(element);
            createError(element, 'Postal code must have numeric characters only');
          }

          if (this.postalCodeLength && isOverMaxLength(value, this.postalCodeLength)) {
            removeError(element);
            createError(
              element,
              `Postal code for ${this.currentValidateCountry} must have ${this.postalCodeLength} characters`,
            );
          }
          break;
        default:
      }
    }
  }

  public validateFocusOut(element: HTMLInputElement): void {
    removeHelp(element);
    const { value } = element;
    const parent: HTMLElement | null = element.closest('.form-item');

    if (value) {
      switch (element.dataset.type) {
        case 'email':
          if (!isEmailFormat(value)) {
            createError(element, 'Incorrect email address!');
          }
          break;
        case 'age':
          if (isLessLengthLimit(value, dateFormatLength) && parent && !parent.classList.contains('form-item--error')) {
            createError(element, 'Please enter your date of birth in the format: DD.MM.YYYY');
          }
          break;
        case 'password':
          if (isWithinLengthLimit(value, passwordFormatLength)) {
            removeError(element);
            createError(element, 'Must contain at least 8 characters');
          }
          break;
        case 'postal-code':
          if (element.classList.contains('billing-adress__input')) {
            this.currentValidateCountry = this.billingCountry;
          } else if (element.classList.contains('shipping-adress__input')) {
            this.currentValidateCountry = this.shippingCountry;
          }
          if (this.postalCodeLength) {
            if (isOverMaxLength(value, this.postalCodeLength) || isLessLengthLimit(value, this.postalCodeLength)) {
              removeError(element);
              createError(
                element,
                `Postal code for ${this.currentValidateCountry} must have ${this.postalCodeLength} characters`,
              );
            }
          }
          break;
        default:
      }
    } else {
      this.removeLabels(element);
    }
  }

  public isValidForm(): boolean {
    let isValid = true;

    const formElements = getElementCollection('.form-item-element');

    formElements.forEach((element) => {
      const formElement = element as HTMLInputElement | HTMLSelectElement;

      if (formElement.value === '') {
        if (!formElement.getAttribute('disabled')) {
          createError(formElement, 'Please, fill out this field');
        }
        if (formElement.classList.contains('select')) {
          createError(formElement, 'Please, select your country');
        }
      }

      if (formElement.closest('.form-item')?.classList.contains('.form-item--error') || formElement.value === '') {
        isValid = false;
      }
    });
    return isValid;
  }

  public validateSubmit(): void {
    this.isValidForm();
  }

  public createCommonData(elements: NodeListOf<Element>): Data {
    const commonData: Data = {};

    elements.forEach((element) => {
      const commonDataElement = element as HTMLInputElement;
      commonData[`${commonDataElement.getAttribute('data-type')}`] = commonDataElement.value;
    });

    return commonData;
  }

  public createAdressData(elements: NodeListOf<Element>): Data {
    const adressData: Data = {};

    elements.forEach((element) => {
      const adressDataElement = element as HTMLInputElement | HTMLSelectElement;
      adressData[`${adressDataElement.getAttribute('data-type')}`] = adressDataElement.value;
    });

    return adressData;
  }
}

export default Validator;
