import {
  AdressCategories,
  CheckboxNames,
  Countries,
  CountryCodes,
  FieldNames,
  InputUserError,
  PopupMessages,
} from '../../../types/enums';
import { BaseAdress, CustomerData, FormAdressData } from '../../../types/interfaces';
import { createCustomer } from '../../api/apiClient';
import { getElement, getElementCollection, renderPopup } from '../../helpers/functions';
import Router from '../../router/router';
import {
  createError,
  getDateFromString,
  getDateISOStringWithoutTime,
  removeError,
} from '../../validation/validationHelpers';
import Validator from '../../validation/validator';
import RegistrationView from './registrationPageView';
import '../../../style/toastify.css';
import { PageUrls } from '../../../assets/data/constants';
import { emailWord } from '../../validation/regExpVariables';
import Controller from '../../controller/controller';

class RegistrationController {
  private validator: Validator;

  private registrationView: RegistrationView;

  private router: Router;

  public isCommonAdress: boolean;

  constructor(router: Router, registrationView: RegistrationView) {
    this.validator = new Validator();
    this.registrationView = registrationView;
    this.router = router;
    this.isCommonAdress = false;
    this.runHandlers();
  }

  public runHandlers(): void {
    this.addFormInputHandlers();
    this.addFormSelectHandlers();
    this.addPasswordBtnHandler();
    this.addCommonAdressCheckboxHandler();
    this.addSubmitFormButtonHandler();
    this.addLoginBtnHandler();
  }

  public addFormInputHandlers(): void {
    const formItemInputElements = getElementCollection('.form-item .input');

    formItemInputElements.forEach((element) => {
      const inputElement = element as HTMLInputElement;

      inputElement.addEventListener('input', (e: Event) => {
        e.preventDefault();
        this.validator.validateRealTime(inputElement);
      });

      inputElement.addEventListener('focusout', (e: Event) => {
        e.preventDefault();
        this.validator.validateFocusOut(inputElement);
      });
    });
  }

  public addFormSelectHandlers(): void {
    const formItemSelectElements = getElementCollection('.form-item .select');

    formItemSelectElements.forEach((element) => {
      const adressCategory = element.getAttribute('category');
      const selectElement = element as HTMLSelectElement;

      selectElement.addEventListener('change', () => {
        const adressInputs = getElementCollection(`.${adressCategory}-adress__input`);
        adressInputs.forEach((input) => {
          const inputElement = input as HTMLInputElement;
          removeError(inputElement);
          inputElement.value = '';
          inputElement.disabled = false;
        });
      });

      selectElement.addEventListener('focusout', () => {
        this.validator.setCountryFromSelectValue(adressCategory, selectElement);
      });
    });
  }

  public addPasswordBtnHandler(): void {
    const passwordBtn: HTMLButtonElement = getElement('.password-input-btn');
    const passwordInput: HTMLInputElement = getElement('.password-input');

    passwordBtn.addEventListener('click', () => {
      this.registrationView.togglePasswordView(passwordInput, passwordBtn);
    });
  }

  public addSubmitFormButtonHandler(): void {
    const submitFormButton: HTMLButtonElement = getElement('.registration-form__button');

    submitFormButton.addEventListener('click', async (e: Event) => {
      e.preventDefault();
      await this.validateSubmit();
    });
  }

  public addCommonAdressCheckboxHandler(): void {
    const commonAdressCheckbox: HTMLInputElement = getElement('.use-as-billing-adress__input');

    commonAdressCheckbox.addEventListener('change', () => {
      this.isCommonAdress = commonAdressCheckbox.checked;
      this.registrationView.toggleBillingAdressView();
      this.addFormSelectHandlers();
      this.addFormInputHandlers();
    });
  }

  public createCustomerData(elements: NodeListOf<Element>): CustomerData {
    const commonData: CustomerData = {
      email: '',
      password: '',
    };

    elements.forEach((element) => {
      const commonDataElement = element as HTMLInputElement;

      switch (commonDataElement.getAttribute('data-type')) {
        case FieldNames.Name:
          commonData.firstName = commonDataElement.value;
          break;
        case FieldNames.Surname:
          commonData.lastName = commonDataElement.value;
          break;
        case FieldNames.Age:
          commonData.dateOfBirth = getDateISOStringWithoutTime(getDateFromString(commonDataElement.value));
          break;
        case FieldNames.Password:
          commonData.password = commonDataElement.value;
          break;
        case FieldNames.Email:
          commonData.email = commonDataElement.value;
          break;
        default:
      }
    });

    commonData.addresses = [];
    commonData.shippingAddresses = [];
    commonData.billingAddresses = [];

    const shippingAdressIndex = 0;
    const billingAdressIndex = 1;

    const shippingAdress: FormAdressData = this.createAdress(AdressCategories.Shipping);

    commonData.addresses?.push(shippingAdress.data as BaseAdress);
    commonData.shippingAddresses?.push(shippingAdressIndex);

    if (shippingAdress.isDefault) {
      commonData.defaultShippingAddress = shippingAdressIndex;
    }

    if (this.isCommonAdress) {
      commonData.billingAddresses?.push(shippingAdressIndex);
      if (shippingAdress.isDefault) {
        commonData.defaultBillingAddress = shippingAdressIndex;
      }
    } else {
      const billingAdress = this.createAdress(AdressCategories.Billing);

      commonData.addresses?.push(billingAdress.data as BaseAdress);
      commonData.billingAddresses?.push(billingAdressIndex);

      if (billingAdress.isDefault) {
        commonData.defaultBillingAddress = billingAdressIndex;
      }
    }

    return commonData;
  }

  public createAdress(category: string): FormAdressData {
    const adressData: FormAdressData = {
      category,
      isDefault: false,
    };

    const baseAdressData: Partial<BaseAdress> = {};
    const adressDataElements = getElementCollection(`.${category}-adress .form-item-element`);

    adressDataElements.forEach((element) => {
      const data = baseAdressData as BaseAdress;
      const adressDataElement = element as HTMLInputElement | HTMLSelectElement;
      const countryCode = this.getCountryCode(adressDataElement.value);

      switch (adressDataElement.getAttribute('data-type')) {
        case FieldNames.Country:
          if (countryCode) {
            data.country = countryCode;
          }
          break;
        case FieldNames.City:
          data.city = adressDataElement.value;
          break;
        case FieldNames.Street:
          data.streetName = adressDataElement.value;
          break;
        case FieldNames.PostalCode:
          data.postalCode = adressDataElement.value;
          break;

        default:
      }
    });

    const adressCheckboxes = getElementCollection('.adress-checkboxes .input');

    adressCheckboxes.forEach((element) => {
      const adressDataElement = element as HTMLInputElement;

      switch (adressDataElement.getAttribute('data-type')) {
        case CheckboxNames.DefaultAdress:
          if (adressDataElement.checked && adressDataElement.classList.contains(`${category}-adress__input`)) {
            adressData.isDefault = true;
          }
          break;
        case CheckboxNames.UseAsBillingAdress:
          if (adressDataElement.checked) {
            adressData.additionalCategory = AdressCategories.Billing;
          }
          break;
        default:
      }
    });

    adressData.data = baseAdressData as BaseAdress;

    return adressData;
  }

  public getCountryCode(value: string): string | undefined {
    let countryCode;

    if (value === Countries.Belarus) {
      countryCode = CountryCodes.Belarus;
    } else if (value === Countries.Spain) {
      countryCode = CountryCodes.Spain;
    } else if (value === Countries.Netherlands) {
      countryCode = CountryCodes.Netherlands;
    }

    return countryCode;
  }

  public isValidForm(): boolean {
    let isValid = true;

    const formElements = getElementCollection('.form-item-element');

    formElements.forEach((element) => {
      const formElement = element as HTMLInputElement | HTMLSelectElement;

      const parentElement = formElement.closest('.form-item');

      if (!formElement.value && !formElement.getAttribute('disabled')) {
        createError(formElement, InputUserError.EmptyFieldError);
      }
      if (!formElement.value && formElement.classList.contains('select')) {
        createError(formElement, InputUserError.CountryError);
      }
      if (formElement.value === '' || parentElement?.classList.contains('form-item--error')) {
        isValid = false;
      }
    });

    return isValid;
  }

  public async validateSubmit(): Promise<void> {
    if (this.isValidForm()) {
      const formCommonDataElements = getElementCollection('.common-data-container .form-item-element');
      const customerData = this.createCustomerData(formCommonDataElements);
      const responce = await createCustomer(customerData);
      const emailInput: HTMLInputElement = getElement('.input[data-type="email"]');
      const passwordInput: HTMLInputElement = getElement('.input[data-type="password"]');

      if (responce instanceof Error) {
        const errorMessage = `${responce.message}`;

        if (errorMessage.match(emailWord)) {
          const inputErrorMessage = InputUserError.ExistingEmailError;
          createError(emailInput, inputErrorMessage);
        }

        renderPopup(false, errorMessage);

        return;
      }

      const succesResponceMessage = PopupMessages.SuccesfullyRegistered;

      renderPopup(true, succesResponceMessage);

      const email = emailInput.value;
      const password = passwordInput.value;

      Controller.loginAction(email, password, this.router);

      this.router.navigateFromButton(PageUrls.IndexPageUrl);
    }
  }

  private addLoginBtnHandler(): void {
    const loginBtn: HTMLButtonElement = getElement('.login-container__button');

    loginBtn.addEventListener('click', () => {
      this.router.navigateFromButton('login');
    });
  }
}

export default RegistrationController;
