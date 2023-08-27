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

class ProfileController {
  private router: Router;

  public authorizedCustomerID: string | undefined;

  constructor(router: Router) {
    this.router = router;
    this.authorizedCustomerID = getCookie('userID') || undefined;
    this.runHandlers();
  }

  public async runHandlers(): Promise<void> {
    await this.addBtnHandlers();
    await this.addValues();
  }

  public async addBtnHandlers(): Promise<void> {
    const buttons = getElementCollection(`.profile-btn-submit`);
    console.log(buttons);

    buttons.forEach(async (element) => {
      const button = element as HTMLButtonElement;
      button.addEventListener('click', async (e: Event) => {
        e.preventDefault();
        const inputs = getElementCollection(`.${button.getAttribute('category')}-data-item__input`);
        await this.btnDataHandler(inputs);
        this.toggleProfileEditMode(inputs);
      });
    });
  }

  public toggleProfileEditMode(inputs: NodeListOf<Element>): void {
    inputs.forEach((element) => {
      const input = element as HTMLInputElement;
      if (!input.classList.contains('profile-input--hidden')) {
        input.classList.add('profile-input--hidden');
        input.readOnly = true;
      } else {
        input.classList.remove('profile-input--hidden');
        input.removeAttribute('readonly');
      }
    });
  }

  public async btnDataHandler(inputs: NodeListOf<Element>): Promise<void> {
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
        case 'name':
          await updateFirstName(this.authorizedCustomerID, input.value, version);
          break;
        case 'surname':
          await updateLastName(this.authorizedCustomerID, input.value, version);
          break;
        case 'age':
          await updateDateOfBirth(this.authorizedCustomerID, input.value, version);
          break;
        case 'email':
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
        case 'name':
          personalDataInput.value = dataResult.firstName || '';
          break;
        case 'surname':
          personalDataInput.value = dataResult.lastName || '';
          break;
        case 'age':
          personalDataInput.value = dataResult.dateOfBirth || '';
          break;
        case 'email':
          personalDataInput.value = dataResult.email || '';
          break;
        default:
      }
    });
  }
}

export default ProfileController;
