import { CustomerDraft } from '@commercetools/platform-sdk';
import {
  updateDateOfBirth,
  updateFirstName,
  updateLastName,
  getUpdatedCustomer,
  getUpdatedVersion,
  updateEmailAdress,
} from '../../api/apiClient';
import { getCookie, getElementCollection } from '../../helpers/functions';
import Router from '../../router/router';
import Validator from '../../validation/validator';
import { FieldNames, InputUserError, ProfileDataBtns, ProfileDataCategories } from '../../../types/enums';
import {
  createError,
  getDateDMYFormatFromIsoString,
  getDateFromString,
  getDateISOStringWithoutTime,
} from '../../validation/validationHelpers';

class ProfileController {
  private router: Router;

  private validator: Validator;

  public authorizedCustomerID: string | undefined;

  constructor(router: Router) {
    this.router = router;
    this.validator = new Validator();
    this.authorizedCustomerID = getCookie('userID') || undefined;
    this.addValues();
    this.runHandlers();
  }

  public async runHandlers(): Promise<void> {
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

  public async addBtnHandlers(): Promise<void> {
    const buttons = getElementCollection(`.profile-btn-submit`);
    console.log(buttons);

    buttons.forEach(async (element) => {
      const button = element as HTMLButtonElement;
      button.addEventListener('click', async (e: Event) => {
        e.preventDefault();
        const inputs = getElementCollection(`.${button.getAttribute('category')}-data-item__input`);
        if (this.isValidData(inputs)) {
          this.toggleInputsEditMode(inputs);
          this.toggleBtnEditMode(button);
          await this.updateData(inputs);
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

  public async updateData(inputs: NodeListOf<Element>): Promise<void> {
    // eslint-disable-next-line no-restricted-syntax
    for await (const element of inputs) {
      const input = element as HTMLInputElement;

      if (!this.authorizedCustomerID) {
        return;
      }

      const version = await getUpdatedVersion(this.authorizedCustomerID);

      if (!version) {
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
    }
  }

  public async addValues(): Promise<void> {
    const personalDataInputs = getElementCollection('.profile-input');

    personalDataInputs.forEach(async (element) => {
      if (!this.authorizedCustomerID) {
        return;
      }
      const data = await getUpdatedCustomer(this.authorizedCustomerID);
      const dataResult = data as CustomerDraft;
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
      const input = element as HTMLInputElement | HTMLSelectElement;

      const parentElement = input.closest('.form-item');

      if (input.value === '' || parentElement?.classList.contains('form-item--error')) {
        isValid = false;
      }

      if (!input.value) {
        createError(input, InputUserError.EmptyFieldError);
      }
    });

    return isValid;
  }
}

export default ProfileController;
