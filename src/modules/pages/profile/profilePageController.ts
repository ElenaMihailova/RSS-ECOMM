import { CustomerDraft } from '@commercetools/platform-sdk';
import {
  updateDateOfBirth,
  updateFirstName,
  updateLastName,
  getUpdatedCustomer,
  getUpdatedVersion,
  updateEmailAdress,
} from '../../api/apiClient';
import { getCookie, getElementCollection, renderPopup } from '../../helpers/functions';
import Router from '../../router/router';
import Validator from '../../validation/validator';
import {
  FieldNames,
  InputUserError,
  PopupMessages,
  ProfileDataBtns,
  ProfileDataCategories,
} from '../../../types/enums';
import {
  createError,
  getDateDMYFormatFromIsoString,
  getDateFromString,
  getDateISOStringWithoutTime,
} from '../../validation/validationHelpers';

class ProfileController {
  private router: Router;

  private validator: Validator;

  public authorizedCustomerVersion: number | undefined;

  public authorizedCustomerID: string | undefined;

  constructor(router: Router) {
    this.router = router;
    this.validator = new Validator();
    this.authorizedCustomerID = getCookie('userID') || undefined;
    this.authorizedCustomerVersion = 0;
    this.addValues();
    this.runHandlers();
  }

  public async runHandlers(): Promise<void> {
    await this.setCurrentCustomerVersion();
    this.addFormInputHandlers();
    await this.addBtnHandlers();
  }

  public addFormInputHandlers(): void {
    const formItemInputElements = getElementCollection('.profile-input');

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

  public async setCurrentCustomerVersion(): Promise<void> {
    if (!this.authorizedCustomerID) {
      return;
    }

    const version = await getUpdatedVersion(this.authorizedCustomerID);

    if (!version) {
      return;
    }

    this.authorizedCustomerVersion = version;
  }

  public async addBtnHandlers(): Promise<void> {
    const buttons = getElementCollection(`.profile-btn-submit`);

    buttons.forEach(async (element) => {
      const button = element as HTMLButtonElement;
      button.addEventListener('click', async (e: Event) => {
        e.preventDefault();
        const category = button.getAttribute('category');
        const inputs = getElementCollection(`.${button.getAttribute('category')}-data-item__input`);

        if (!this.isValidData(inputs)) {
          renderPopup(false, PopupMessages.ProfileCorrectData);
          return;
        }

        this.toggleInputsEditMode(inputs);
        this.toggleBtnEditMode(button);
        const oldCustomerVersion = this.authorizedCustomerVersion;
        await this.updateData(inputs);

        if (
          !button.classList.contains('profile-btn-submit--edit-mode') &&
          Number(oldCustomerVersion) < Number(this.authorizedCustomerVersion) &&
          category
        ) {
          this.renderSuccesPopup(category);
        }
      });
    });
  }

  public toggleInputsEditMode(inputs: NodeListOf<Element>): void {
    inputs.forEach((element) => {
      const input = element as HTMLInputElement;
      if (!input.classList.contains('profile-input--hidden')) {
        input.classList.add('profile-input--hidden');
        input.disabled = true;
      } else {
        input.classList.remove('profile-input--hidden');
        input.disabled = false;
      }
    });
  }

  public toggleBtnEditMode(buttonElement: HTMLButtonElement): void {
    const button = buttonElement;
    if (!button.classList.contains('profile-btn-submit--edit-mode')) {
      button.classList.add('profile-btn-submit--edit-mode');
      button.textContent = 'Save changes';
    } else {
      button.classList.remove('profile-btn-submit--edit-mode');
      switch (button.getAttribute('category')) {
        case ProfileDataCategories.Personal:
          button.textContent = ProfileDataBtns.Personal;
          break;
        case ProfileDataCategories.Contact:
          button.textContent = ProfileDataBtns.Contact;
          break;
        case ProfileDataCategories.Password:
          button.textContent = ProfileDataBtns.Password;
          break;
        default:
      }
    }
  }

  public renderSuccesPopup(category: string): void {
    switch (category) {
      case ProfileDataCategories.Personal:
        renderPopup(true, PopupMessages.PersonalDataUpdated);
        break;
      case ProfileDataCategories.Contact:
        renderPopup(true, PopupMessages.ContactDataUpdated);
        break;
      case ProfileDataCategories.Password:
        renderPopup(true, PopupMessages.PasswordChanged);
        break;
      default:
    }
  }

  public async updateData(inputs: NodeListOf<Element>): Promise<void> {
    // eslint-disable-next-line no-restricted-syntax
    for await (const element of inputs) {
      const input = element as HTMLInputElement;

      const version = this.authorizedCustomerVersion;

      if (!version || !this.authorizedCustomerID) {
        return;
      }

      switch (input.dataset.type) {
        case FieldNames.Name:
          await updateFirstName(this.authorizedCustomerID, input.value, version);
          break;
        case FieldNames.Surname:
          await updateLastName(this.authorizedCustomerID, input.value, version);
          break;
        case FieldNames.Age:
          await updateDateOfBirth(
            this.authorizedCustomerID,
            getDateISOStringWithoutTime(getDateFromString(input.value)),
            version,
          );
          break;
        case FieldNames.Email:
          await updateEmailAdress(this.authorizedCustomerID, input.value, version);
          break;
        default:
      }

      await this.setCurrentCustomerVersion();
    }
  }

  public async addValues(): Promise<void> {
    const personalDataInputs = getElementCollection('.profile-input');

    if (!this.authorizedCustomerID) {
      return;
    }

    const data = await getUpdatedCustomer(this.authorizedCustomerID);
    const dataResult = data as CustomerDraft;

    personalDataInputs.forEach((element) => {
      const personalDataInput = element as HTMLInputElement;
      switch (personalDataInput.dataset.type) {
        case FieldNames.Name:
          personalDataInput.value = dataResult.firstName || '';
          break;
        case FieldNames.Surname:
          personalDataInput.value = dataResult.lastName || '';
          break;
        case FieldNames.Age:
          personalDataInput.value = getDateDMYFormatFromIsoString(dataResult.dateOfBirth || '') || '';
          break;
        case FieldNames.Email:
          personalDataInput.value = dataResult.email || '';
          break;
        default:
      }
    });
  }

  public isValidData(inputs: NodeListOf<Element>): boolean {
    let isValid = true;

    inputs.forEach((element) => {
      const input = element as HTMLInputElement;

      const parentElement = input.closest('.form-item');

      if (parentElement?.classList.contains('form-item--error')) {
        isValid = false;
      }

      if (!input.value) {
        isValid = false;
        createError(input, InputUserError.EmptyFieldError);
      }
    });

    return isValid;
  }
}

export default ProfileController;
