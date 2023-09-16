import { AnonymousAuthMiddlewareOptions } from '@commercetools/sdk-client-v2';
import { AddressCategories, CheckboxNames, FieldNames, InputUserError, PopupMessages } from '../../../types/enums';
import { BaseAddress, CustomerData, FormAddressData } from '../../../types/interfaces';
import { createCustomer } from '../../api';
import {
  getCountryCode,
  getElement,
  getElementCollection,
  getFromLS,
  renderPopup,
  setToLS,
  togglePasswordView,
} from '../../helpers/functions';
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
import ApiClientBuilder, { scopes } from '../../api/buildRoot';
import MyTokenCache from '../../api/myTokenCache';

class RegistrationController {
  private validator: Validator;

  private registrationView: RegistrationView;

  private router: Router;

  public isCommonAddress: boolean;

  constructor(router: Router, registrationView: RegistrationView) {
    this.validator = new Validator();
    this.registrationView = registrationView;
    this.router = router;
    this.isCommonAddress = false;
    this.runHandlers();
  }

  public runHandlers(): void {
    this.addFormInputHandlers();
    this.addFormSelectHandlers();
    this.addCommonAddressCheckboxHandler();
    this.addSubmitFormButtonHandler();
    this.addLoginBtnHandler();
    this.addPasswordViewBtnHandler();
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
      const addressCategory = element.getAttribute('category');
      const selectElement = element as HTMLSelectElement;

      selectElement.addEventListener('change', () => {
        const addressInputs = getElementCollection(`.${addressCategory}-address__input`);
        addressInputs.forEach((input) => {
          const inputElement = input as HTMLInputElement;
          removeError(inputElement);
          inputElement.value = '';
          inputElement.disabled = false;
        });
      });

      selectElement.addEventListener('focusout', () => {
        this.validator.setCountryFromSelectValue(selectElement, addressCategory);
      });
    });
  }

  public addSubmitFormButtonHandler(): void {
    const submitFormButton: HTMLButtonElement = getElement('.registration-form__button');

    submitFormButton.addEventListener('click', async (e: Event) => {
      e.preventDefault();
      await this.validateSubmit();
    });
  }

  public addPasswordViewBtnHandler(): void {
    const passwordBtn: HTMLButtonElement = getElement('.password-input-btn');
    const passwordInput: HTMLInputElement = getElement('[data-type="password"]');

    passwordBtn.addEventListener('click', () => {
      togglePasswordView(passwordInput, passwordBtn);
    });
  }

  public addCommonAddressCheckboxHandler(): void {
    const commonAddressCheckbox: HTMLInputElement = getElement('.use-as-billing-address__input');

    commonAddressCheckbox.addEventListener('change', () => {
      this.isCommonAddress = commonAddressCheckbox.checked;
      this.registrationView.toggleBillingAddressView();
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

    const shippingAddressIndex = 0;
    const billingAddressIndex = 1;

    const shippingAddress: FormAddressData = this.createAddress(AddressCategories.Shipping);

    commonData.addresses?.push(shippingAddress.data as BaseAddress);
    commonData.shippingAddresses?.push(shippingAddressIndex);

    if (shippingAddress.isDefault) {
      commonData.defaultShippingAddress = shippingAddressIndex;
    }

    if (this.isCommonAddress) {
      commonData.billingAddresses?.push(shippingAddressIndex);
      if (shippingAddress.isDefault) {
        commonData.defaultBillingAddress = shippingAddressIndex;
      }
    } else {
      const billingAddress = this.createAddress(AddressCategories.Billing);

      commonData.addresses?.push(billingAddress.data as BaseAddress);
      commonData.billingAddresses?.push(billingAddressIndex);

      if (billingAddress.isDefault) {
        commonData.defaultBillingAddress = billingAddressIndex;
      }
    }

    return commonData;
  }

  public createAddress(category: string): FormAddressData {
    const addressData: FormAddressData = {
      category,
      isDefault: false,
    };

    const baseAddressData: Partial<BaseAddress> = {};
    const addressDataElements = getElementCollection(`.${category}-address .form-item-element`);

    addressDataElements.forEach((element) => {
      const data = baseAddressData as BaseAddress;
      const addressDataElement = element as HTMLInputElement | HTMLSelectElement;
      const countryCode = getCountryCode(addressDataElement.value);

      switch (addressDataElement.getAttribute('data-type')) {
        case FieldNames.Country:
          if (countryCode) {
            data.country = countryCode;
          }
          break;
        case FieldNames.City:
          data.city = addressDataElement.value;
          break;
        case FieldNames.Street:
          data.streetName = addressDataElement.value;
          break;
        case FieldNames.PostalCode:
          data.postalCode = addressDataElement.value;
          break;

        default:
      }
    });

    const addressCheckboxes = getElementCollection('.address-checkboxes .input');

    addressCheckboxes.forEach((element) => {
      const addressDataElement = element as HTMLInputElement;

      switch (addressDataElement.getAttribute('data-type')) {
        case CheckboxNames.DefaultAddress:
          if (addressDataElement.checked && addressDataElement.classList.contains(`${category}-address__input`)) {
            addressData.isDefault = true;
          }
          break;
        case CheckboxNames.UseAsBillingAddress:
          if (addressDataElement.checked) {
            addressData.additionalCategory = AddressCategories.Billing;
          }
          break;
        default:
      }
    });

    addressData.data = baseAddressData as BaseAddress;

    return addressData;
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
      const emailInput: HTMLInputElement = getElement('.input[data-type="email"]');
      const passwordInput: HTMLInputElement = getElement('.input[data-type="password"]');

      let response = null;

      if (!getFromLS('refreshToken')) {
        const tokenCache = new MyTokenCache();

        const anonymousAuthMiddlewareOptions: AnonymousAuthMiddlewareOptions = {
          host: process.env.CTP_AUTH_URL as string,
          projectKey: process.env.CTP_PROJECT_KEY as string,
          credentials: {
            clientId: process.env.CTP_CLIENT_ID as string,
            clientSecret: process.env.CTP_CLIENT_SECRET as string,
          },
          tokenCache,
          scopes,
          fetch,
        };

        ApiClientBuilder.currentRoot = ApiClientBuilder.createApiRootWithAnonymousFlow(anonymousAuthMiddlewareOptions);

        response = await createCustomer(ApiClientBuilder.currentRoot, customerData);

        const tokenInfo = tokenCache.get();
        setToLS('token', tokenInfo.token);
        if (tokenInfo.refreshToken) {
          setToLS('refreshToken', tokenInfo.refreshToken);
        }
      } else {
        response = await createCustomer(ApiClientBuilder.currentRoot, customerData);
      }

      if (response instanceof Error) {
        const errorMessage = `${response.message}`;

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
      const activeCartSignInMode = 'MergeWithExistingCustomerCart';
      const updateProductData = true;

      Controller.loginAction(email, password, activeCartSignInMode, updateProductData, this.router);

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
