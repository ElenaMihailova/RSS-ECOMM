import { AddressCategories, Countries, FieldNames, InputUserError, PostalCodes } from '../../types/enums';
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
  isOnlyNumbers,
  isOverOrEqualMaxLength,
} from './validationChecks';
import { getElement } from '../helpers/functions';
import { getAddressContainerSelector } from '../pages/profile/profileHelpers';

class Validator {
  private billingCountry: string | null;

  private shippingCountry: string | null;

  private currentValidateCountry: string | null;

  public postalCodeLength: number | null;

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

    if (!value) {
      return;
    }

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
        if (isOverOrEqualMaxLength(value, passwordFormatLength)) {
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
        if (element.classList.contains('billing-address__input')) {
          this.currentValidateCountry = this.billingCountry;
        } else if (element.classList.contains('shipping-address__input')) {
          this.currentValidateCountry = this.shippingCountry;
        }

        if (!isOnlyNumbers(value)) {
          removeError(element);
          createError(element, InputUserError.PostalCodeError);
        }

        if (this.postalCodeLength && isOverMaxLength(value, this.postalCodeLength)) {
          removeError(element);
          createError(
            element,
            `Postal code for ${this.currentValidateCountry} must have ${this.postalCodeLength} numeric characters`,
          );
        }
        break;
      default:
    }
  }

  public setCountryFromSelectValue(element: HTMLSelectElement, category?: string | null): void {
    if (category === AddressCategories.Billing) {
      this.billingCountry = element.value;
    } else if (category === AddressCategories.Shipping) {
      this.shippingCountry = element.value;
    }

    if (!category) {
      this.currentValidateCountry = element.value;
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

  public validateProfilePostalCode(selectElement: HTMLSelectElement): void {
    this.setCountryFromSelectValue(selectElement);

    const containerSelector = getAddressContainerSelector(selectElement);
    const postalCodeInput: HTMLInputElement = getElement(`${containerSelector} [data-type="postal-code"]`);

    removeError(postalCodeInput);
    this.validateFocusOut(postalCodeInput);
  }

  public validateProfileFormELements(formELements: NodeListOf<Element>): boolean {
    let isValid = true;

    formELements.forEach((element) => {
      const formELement = element as HTMLInputElement;

      const parentElement = formELement.closest('.form-item');

      if (parentElement?.classList.contains('form-item--error')) {
        isValid = false;
      }

      if (!formELement.value) {
        isValid = false;
        createError(formELement, InputUserError.EmptyFieldError);
      }
    });

    return isValid;
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
        if (element.classList.contains('billing-address__input')) {
          this.currentValidateCountry = this.billingCountry;
        } else if (element.classList.contains('shipping-address__input')) {
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
