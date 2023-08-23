import { AdressCategories, Countries, FieldNames, InputUserError, PostalCodes } from '../../types/enums';
import { Data } from '../../types/types';
import { getElementCollection } from '../helpers/functions';
import { removeError, removeHelp, createError, createHelp } from './validationHelpers';
import {
  dateFormatLength,
  isDateFormat,
  isPasswordFormat,
  isLessMinAge,
  isMaxLength,
  isOverMaxLength,
  hasLetters,
  hasNumbers,
  hasNumbersAndDots,
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
            createError(element, InputUserError.InvalidDataError);
          } else if (isMaxLength(value, dateFormatLength) && isDateFormat(value) && isLessMinAge(value, this.minAge)) {
            createError(element, `User must be at least ${this.minAge} years old`);
          } else if (isOverMaxLength(value, dateFormatLength)) {
            createError(element, InputUserError.TooManyCharactersError);
          }

          break;
        case FieldNames.Password:
          if (isOverMaxLength(value, passwordFormatLength)) {
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
        case FieldNames.LoginEmail:
          if (!isEmailFormat(value)) {
            createError(element, InputUserError.EmailError);
          }
          break;
        case FieldNames.LoginPassword:
          if (
            isLessLengthLimit(value, passwordFormatLength) ||
            hasLSpaces(value) ||
            hasTSpaces(value) ||
            !hasLowerLetters(value) ||
            !hasNumbers(value) ||
            !hasUpperLetters(value)
          ) {
            createError(element, InputUserError.PasswordError);
          }
          break;
        case FieldNames.PostalCode:
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

  public setCountryFromSelectValue(category: string | null, element: HTMLSelectElement): void {
    removeError(element);

    if (category === AdressCategories.Billing) {
      this.billingCountry = element.value;
    } else if (category === AdressCategories.Shipping) {
      this.shippingCountry = element.value;
    }

    switch (element.value) {
      case Countries.Belarus:
        this.postalCodeLength = PostalCodes.Belarus;
        break;
      case Countries.Spain:
        this.postalCodeLength = PostalCodes.Spain;
        break;
      case Countries.Netherlands:
        this.postalCodeLength = PostalCodes.Netherlands;
        break;
      default:
        this.postalCodeLength = null;
    }
  }

  public validateFocusOut(element: HTMLInputElement): void {
    removeHelp(element);
    const { value } = element;
    const parent: HTMLElement | null = element.closest('.form-item');

    if (!value) {
      this.removeLabels(element);
      return;
    }

    switch (element.dataset.type) {
      case FieldNames.Email:
        if (!isEmailFormat(value)) {
          createError(element, InputUserError.EmailError);
        }
        break;
      case FieldNames.Age:
        if (isLessLengthLimit(value, dateFormatLength) && parent && !parent.classList.contains('form-item--error')) {
          createError(element, InputUserError.BirthdayFormatError);
        }
        break;
      case FieldNames.Password:
        if (isLessLengthLimit(value, passwordFormatLength)) {
          removeError(element);
          createError(element, InputUserError.PasswordLengthError);
        }
        break;
      case FieldNames.PostalCode:
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

export default Validator;
