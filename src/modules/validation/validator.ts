import { AdressCategories, Countries, CountryCodes, PostalCodes } from '../../types/enums';
import { CustomerData, BaseAdress, FormAdressData } from '../../types/interfaces';
import { getElementCollection } from '../helpers/functions';
import {
  removeError,
  removeHelp,
  createError,
  createHelp,
  getDateFromString,
  getDateISOStringWithoutTime,
} from './validationHelpers';
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
  passwordFormatLength,
} from './validationChecks';
import { createCustomerWithAdress } from '../api/ApiClient';

class Validator {
  private billingCountry: string | null;

  private shippingCountry: string | null;

  private currentValidateCountry: string | null;

  private postalCodeLength: number | null;

  private readonly minAge = 16;

  public isCommonAdress: boolean;

  constructor() {
    this.postalCodeLength = null;
    this.billingCountry = null;
    this.shippingCountry = null;
    this.currentValidateCountry = null;
    this.isCommonAdress = false;
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

  public async validateSubmit(): Promise<boolean> {
    if (this.isValidForm()) {
      const formCommonDataElements = getElementCollection('.common-data-container .form-item-element');
      const customerData = this.createCustomerData(formCommonDataElements);
      const shippingAdress = this.createAdress(AdressCategories.shipping);

      if (this.isCommonAdress) {
        await createCustomerWithAdress(customerData, shippingAdress);
      } else {
        const billingAdress = this.createAdress(AdressCategories.billing);
        await createCustomerWithAdress(customerData, shippingAdress, billingAdress);
      }
    }
    return false;
  }

  public createCustomerData(elements: NodeListOf<Element>): CustomerData {
    const commonData: CustomerData = {
      email: '',
      password: '',
    };

    elements.forEach((element) => {
      const commonDataElement = element as HTMLInputElement;

      switch (commonDataElement.getAttribute('data-type')) {
        case 'name':
          commonData.firstName = commonDataElement.value;
          break;
        case 'surname':
          commonData.lastName = commonDataElement.value;
          break;
        case 'age':
          commonData.dateOfBirth = getDateISOStringWithoutTime(getDateFromString(commonDataElement.value));
          break;
        case 'password':
          commonData.password = commonDataElement.value;
          break;
        case 'email':
          commonData.email = commonDataElement.value;
          break;
        default:
      }
    });

    return commonData;
  }

  public createAdress(category: string): FormAdressData {
    const adressData: FormAdressData = {
      category,
      isDefault: false,
    };

    const baseAdressdata: BaseAdress | object = {};

    const adressDataElements = getElementCollection(`.${category}-adress .form-item-element`);
    adressDataElements.forEach((element) => {
      const data = baseAdressdata as BaseAdress;
      const adressDataElement = element as HTMLInputElement | HTMLSelectElement;
      switch (adressDataElement.getAttribute('data-type')) {
        case 'country':
          if (adressDataElement.value === Countries.Belarus) {
            data.country = CountryCodes.Belarus;
          } else if (adressDataElement.value === Countries.Spain) {
            data.country = CountryCodes.Spain;
          } else if (adressDataElement.value === Countries.Netherlands) {
            data.country = CountryCodes.Netherlands;
          }
          break;
        case 'city':
          data.city = adressDataElement.value;
          break;
        case 'street':
          data.streetName = adressDataElement.value;
          break;
        case 'postal-code':
          data.postalCode = adressDataElement.value;
          break;

        default:
      }
    });

    const adressCheckboxes = getElementCollection('.adress-checkboxes .input');
    adressCheckboxes.forEach((element) => {
      const adressDataElement = element as HTMLInputElement;
      switch (adressDataElement.getAttribute('data-type')) {
        case 'default-adress':
          if (adressDataElement.checked) {
            adressData.isDefault = true;
          }
          break;
        case 'use-as-billing-adress':
          if (adressDataElement.checked) {
            this.isCommonAdress = true;
            adressData.additionalCategory = AdressCategories.billing;
          }
          break;
        default:
      }
    });

    adressData.data = baseAdressdata as BaseAdress;

    return adressData;
  }
}

export default Validator;
