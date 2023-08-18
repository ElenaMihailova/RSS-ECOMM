import { AdressCategories, PostalCodes } from '../../types/enums';
import { getElementCollection } from '../helpers/functions';
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
  isPasswordFormat,
  hasLowerLetters,
  hasUpperLetters,
  isEmailFormat,
  isLessLengthLimit,
} from './validationRules';

class Validator {
  private billingCountry: string | null;

  private shippingCountry: string | null;

  private currentValidateCountry: string | null;

  private postalCodeLength: number | null;

  private readonly minAge = 16;

  private readonly passwordLength = 8;

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

    if (value === '') {
      this.removeLabels(element);
    } else {
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
        case 'password':
          if (isOverMaxLength(value, this.passwordLength)) {
            if (!isPasswordFormat(value)) {
              removeError(element);
              const passwordErors = [];
              if (!hasNumbers(value)) {
                passwordErors.push('1 number');
              }
              if (!hasLowerLetters(value)) {
                passwordErors.push('1 lowercase letter');
              }
              if (!hasUpperLetters(value)) {
                passwordErors.push('1 uppercase letter');
              }

              const errorString = `Must contain at least: ${passwordErors.join(', ')}`;
              createError(element, errorString);
            }
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

  public setCountryFromSelectValue(category: string | null, element: HTMLSelectElement): void {
    removeError(element);
    if (category === AdressCategories.billing) {
      this.billingCountry = element.value;
    } else if (category === AdressCategories.shipping) {
      this.shippingCountry = element.value;
    }

    switch (element.value) {
      case 'Belarus':
        this.postalCodeLength = PostalCodes.Belarus;
        break;
      case 'Spain':
        this.postalCodeLength = PostalCodes.Spain;
        break;
      case 'Netherlands':
        this.postalCodeLength = PostalCodes.Netherlands;
        break;
      default:
        this.postalCodeLength = null;
    }
  }

  public isValidForm(): boolean {
    let isValid = true;
    const formElements = getElementCollection('.form-item-element');
    formElements.forEach((element) => {
      const formElement = element as HTMLInputElement | HTMLSelectElement;
      if (formElement.value === '') {
        if (formElement.classList.contains('select')) {
          createError(formElement, 'Please, select your country');
        }
        if (!formElement.getAttribute('disabled')) {
          createError(formElement, 'Please, fill out this field');
        }
      }
      if (formElement.closest('.form-item')?.classList.contains('.form-item--error') || formElement.value === '') {
        isValid = false;
      }
    });
    return isValid;
  }

  public validateSubmit(): void {}

  public validateFocusOut(element: HTMLInputElement): void {
    const { value } = element;
    const parent: HTMLElement | null = element.closest('.form-item');

    if (element.value === '') {
      this.removeLabels(element);
    } else {
      switch (element.dataset.type) {
        case 'email':
          if (!isEmailFormat(value)) {
            createError(element, 'Incorrect email address!');
          }
          break;
        case 'age':
          if (
            isWithinLengthLimit(value, this.passwordLength) &&
            parent &&
            !parent.classList.contains('form-item--error')
          ) {
            createError(element, 'Please enter your date of birth in the format: DD.MM.YYYY');
          }
          break;
        case 'password':
          if (isWithinLengthLimit(value, this.passwordLength)) {
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
    }
  }
}

export default Validator;
