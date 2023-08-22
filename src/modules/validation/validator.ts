import { Data } from '../../types/types';
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
import { FieldNames, InputUserError } from '../../types/enums';

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
        case FieldNames.Name:
        case FieldNames.Surname:
        case FieldNames.City:
          if (!hasLetters(value)) {
            createError(element, InputUserError.LettersError);
          }
          break;
        case FieldNames.Age:
          createHelp(element, InputUserError.AgeError);

          if (!hasNumbersAndDots(value)) {
            createError(element, InputUserError.DateSyntaxError);
          } else if (isMaxLength(value, dateFormatLength) && !isDateFormat(value)) {
            createError(element, InputUserError.DataError);
          } else if (isMaxLength(value, dateFormatLength) && isDateFormat(value) && isLessMinAge(value, this.minAge)) {
            createError(element, `User must be at least ${this.minAge} years old`);
          } else if (isOverMaxLength(value, dateFormatLength)) {
            createError(element, InputUserError.DateFormatError);
          }

          break;
        case FieldNames.Email:
          if (!isEmailFormat(value)) {
            createError(element, InputUserError.EmailError);
            loginBtn.setAttribute('disabled', 'disabled');
          } else {
            loginBtn.removeAttribute('disabled');
          }
          break;
        case FieldNames.LoginPassword:
          if (
            isWithinLengthLimit(value, passwordFormatLength) ||
            hasLSpaces(value) ||
            hasTSpaces(value) ||
            !hasLowerLetters(value) ||
            !hasNumbers(value) ||
            !hasUpperLetters(value)
          ) {
            createError(element, InputUserError.PasswordError);
            loginBtn.setAttribute('disabled', 'disabled');
          } else {
            loginBtn.removeAttribute('disabled');
          }
          break;
        case FieldNames.PostaCode:
          if (element.classList.contains('billing-adress__input')) {
            this.currentValidateCountry = this.billingCountry;
          } else if (element.classList.contains('shipping-adress__input')) {
            this.currentValidateCountry = this.shippingCountry;
          }

          if (!hasNumbers(value)) {
            removeError(element);
            createError(element, InputUserError.PostalCodeError);
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

    if (!value) {
      this.removeLabels(element);
    }
    switch (element.dataset.type) {
      case FieldNames.Email:
        if (!isEmailFormat(value)) {
          createError(element, InputUserError.EmailError);
        }
        break;
      case FieldNames.Age:
        if (isLessLengthLimit(value, dateFormatLength) && parent && !parent.classList.contains('form-item--error')) {
          createError(element, InputUserError.BirthdayError);
        }
        break;
      case FieldNames.Password:
        if (isWithinLengthLimit(value, passwordFormatLength)) {
          removeError(element);
          createError(element, InputUserError.PasswordError);
        }
        break;
      case FieldNames.PostaCode:
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

  public isValidForm(): boolean {
    let isValid = true;

    const formElements = getElementCollection('.form-item-element');

    formElements.forEach((element) => {
      const formElement = element as HTMLInputElement | HTMLSelectElement;

      if (formElement.value === '' && !formElement.getAttribute('disabled')) {
        createError(formElement, InputUserError.FieldError);
      }
      if (formElement.value === '' && formElement.classList.contains('select')) {
        createError(formElement, InputUserError.CountryError);
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
