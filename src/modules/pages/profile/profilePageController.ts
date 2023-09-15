import { PageUrls } from '../../../assets/data/constants';
import { getUpdatedCustomer, getUpdatedVersion } from '../../api';
import {
  getFromLS,
  getElementCollection,
  renderPopup,
  getElement,
  togglePasswordView,
  setToLS,
} from '../../helpers/functions';
import Router from '../../router/router';
import Validator from '../../validation/validator';
import {
  PopupMessages,
  ProfileDataBtns,
  ProfileDataCategories,
  Mode,
  ProfileDataContainersTitles,
} from '../../../types/enums';
import ProfileView from './profilePageView';
import { createAddressesData, createNewAddress } from './profileItemsData';
import {
  createNewBaseAdress,
  getAddressContainerMode,
  getAddressContainerSelector,
  getFormElements,
  renderUpdateSuccesPopup,
} from './profileHelpers';
import { updatePassword, updateAddressCategories, updateCustomerData, updateData } from './apiHelpers';
import {
  addAddressesValues,
  addContactDataValue,
  addPersonalDataValues,
  renderAddressContainers,
  renderEditBtn,
  renderRemoveBtn,
  rerenderAddressDetails,
  setNewContainerTitle,
  toggleAddressButtonsDisable,
  toggleAddressCheckboxesView,
  toggleAdressDetailsView,
  toggleBtnEditMode,
  toggleFormElementsEditMode,
} from './rerenderProfileHelpers';
import ApiClientBuilder from '../../api/buildRoot';

class ProfileController {
  private router: Router;

  private validator: Validator;

  private view: ProfileView;

  public authorizedCustomerVersion: number;

  public authorizedCustomerID: string | undefined;

  constructor(router: Router) {
    this.router = router;
    this.validator = new Validator();
    this.view = new ProfileView();
    this.authorizedCustomerID = getFromLS('userID') || undefined;
    this.authorizedCustomerVersion = 0;
    this.addValues().then(() => this.addHandlers());
  }

  public async addValues(): Promise<void> {
    if (!this.authorizedCustomerID) {
      return;
    }

    const data = await getUpdatedCustomer(ApiClientBuilder.currentRoot, this.authorizedCustomerID);

    switch (window.location.pathname.slice(1)) {
      case PageUrls.ProfilePageUrl:
        addPersonalDataValues(data);
        addContactDataValue(data);
        break;
      case `${PageUrls.ProfilePageUrl}/${PageUrls.AddressesPageUrl}`:
        if (data.addresses) {
          const dataAddress = await createAddressesData(this.authorizedCustomerID);

          renderAddressContainers(dataAddress);

          addAddressesValues(data);
          await this.addRemoveBtnsHandler();
        }
        this.view.renderAddNewAddressButton();
        await this.addCreateAddressBtnHandler();
        break;
      case `${PageUrls.ProfilePageUrl}/${PageUrls.ChangePasswordPageUrl}`:
        this.addPasswordViewBtnsHandler();
        this.addPasswordSaveBtnHandler();
        break;
      default:
    }
  }

  public async addHandlers(): Promise<void> {
    this.pageBtnsHandlers();
    await this.setCurrentCustomerVersion();
    await this.addEditBtnsHandler();
    this.addProfileDataHandlers();
  }

  private pageBtnsHandlers(): void {
    const profileBtn = getElement('.profile-data-page-btn');
    const addressesBtn = getElement('.addresses-page-btn');
    const changePasswodBtn = getElement('.change-password-page-btn');

    profileBtn.addEventListener('click', async (): Promise<void> => {
      this.router.navigateFromButton(PageUrls.ProfilePageUrl);
    });

    addressesBtn.addEventListener('click', async (): Promise<void> => {
      this.router.navigateFromButton(`${PageUrls.ProfilePageUrl}/${PageUrls.AddressesPageUrl}`);
    });

    changePasswodBtn.addEventListener('click', (): void => {
      this.router.navigateFromButton(`${PageUrls.ProfilePageUrl}/${PageUrls.ChangePasswordPageUrl}`);
    });
  }

  public async setCurrentCustomerVersion(): Promise<void> {
    if (!this.authorizedCustomerID) {
      return;
    }
    const version = await getUpdatedVersion(ApiClientBuilder.currentRoot, this.authorizedCustomerID);
    setToLS('version', JSON.stringify(version));
    this.authorizedCustomerVersion = version || 0;
  }

  private addProfileDataHandlers(): void {
    this.addAddressSelectHandler();
    this.addFormInputHandlers();
    this.addPostalCodeInputHandler();
    this.addAddressCheckboxesHandler();
  }

  public async addEditBtnsHandler(): Promise<void> {
    const editBtns: NodeListOf<Element> = getElementCollection(`.profile-data-btns [type="${ProfileDataBtns.Edit}"]`);

    editBtns.forEach((element) => {
      const button = element as HTMLButtonElement;
      button.addEventListener('click', async (e: Event) => {
        e.preventDefault();
        this.btnEditHandler(e);
      });
    });
  }

  public async btnEditHandler(e: Event): Promise<void> {
    const editButton = e.target as HTMLButtonElement;
    const container = editButton.closest('.profile-data');
    const mode = container?.getAttribute('mode');
    const category = editButton.getAttribute('category');

    if (mode === Mode.View) {
      this.toggleDataEditMode(editButton);
      return;
    }
    if (!category) {
      return;
    }

    const formElements = getFormElements(editButton, category);

    if (!formElements) {
      return;
    }

    if (!this.validator.isValidProfileData(editButton, formElements)) {
      return;
    }

    const oldCustomerVersion = Number(this.authorizedCustomerVersion);

    await updateData(editButton, category, formElements);

    if (!this.validator.isValidProfileData(editButton, formElements)) {
      return;
    }

    await this.setCurrentCustomerVersion();

    if (oldCustomerVersion < Number(this.authorizedCustomerVersion)) {
      renderUpdateSuccesPopup(category);
    }

    this.toggleDataEditMode(editButton);
  }

  public toggleDataEditMode(buttonElement: HTMLButtonElement): void {
    const dataContainer: HTMLDivElement | null = buttonElement.closest('.profile-data');
    const category = buttonElement.getAttribute('category');
    const button = buttonElement;

    if (!category) {
      return;
    }

    const dataElements = getFormElements(button, category);

    if (!dataElements || !dataContainer) {
      return;
    }

    const mode = getAddressContainerMode(button);

    const newMode = mode !== Mode.Edit ? Mode.Edit : Mode.View;

    dataContainer.setAttribute('mode', newMode);

    toggleFormElementsEditMode(button, dataElements);
    toggleBtnEditMode(button);

    if (category === ProfileDataCategories.Address) {
      toggleAdressDetailsView(dataContainer);
    }
  }

  public addAddressSelectHandler(): void {
    const formItemSelectElements = getElementCollection('.address-select');

    formItemSelectElements.forEach((element) => {
      const selectElement = element as HTMLSelectElement;

      selectElement.addEventListener('change', () => {
        this.validator.validateProfilePostalCode(selectElement);
      });
    });
  }

  public addFormInputHandlers(): void {
    const formItemInputElements = getElementCollection('.profile-element');

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

  public addPostalCodeInputHandler(): void {
    const postalCodeElements = getElementCollection('[data-type="postal-code"]');

    postalCodeElements.forEach((element) => {
      const postalCodeElement = element as HTMLInputElement;

      postalCodeElement.addEventListener('focusin', () => {
        const containerSelector = getAddressContainerSelector(postalCodeElement);
        const selectCountryElement: HTMLSelectElement = getElement(`${containerSelector} [data-type="country"]`);

        this.validator.validateProfilePostalCode(selectCountryElement);
      });
    });
  }

  public addAddressCheckboxesHandler(): void {
    const addressCheckboxElements = getElementCollection('.address-checkboxes .input');

    addressCheckboxElements.forEach((element) => {
      const checkboxElement = element as HTMLInputElement;

      checkboxElement.addEventListener('change', () => {
        toggleAddressCheckboxesView(checkboxElement);
      });
    });
  }

  private async addRemoveBtnsHandler(): Promise<void> {
    const removeBtns: NodeListOf<Element> = getElementCollection(
      `.address-data__btns [type="${ProfileDataBtns.Remove}"]`,
    );

    removeBtns.forEach((element) => {
      const removeButton = element as HTMLButtonElement;
      removeButton.addEventListener('click', (e: Event) => this.removeAddressBtnHandler(e));
    });
  }

  private async removeAddressBtnHandler(e: Event): Promise<void> {
    const removeButton = e.target as HTMLButtonElement;
    const addressID = removeButton.closest('.address-data')?.getAttribute('address-id');

    if (!addressID || !this.authorizedCustomerID) {
      return;
    }

    const container = getElement(`[address-id="${addressID}"]`);

    const actions = [
      {
        action: 'removeAddress',
        addressId: addressID,
      },
    ];

    const response = await updateCustomerData(actions);

    if (!response) {
      return;
    }

    container.remove();
    renderPopup(true, PopupMessages.AddressSuccesfullyRemoved);

    await this.setCurrentCustomerVersion();
  }

  private async addCreateAddressBtnHandler(): Promise<void> {
    const addAddressBtn: HTMLButtonElement = getElement(`.profile-content [type="${ProfileDataBtns.Add}"]`);

    addAddressBtn.addEventListener('click', async () => {
      if (!this.authorizedCustomerID) {
        return;
      }

      const dataAddress = await createNewAddress(this.authorizedCustomerID);
      renderAddressContainers(dataAddress);
      this.addProfileDataHandlers();
      toggleAddressButtonsDisable(Mode.Create);
      this.addBtnSaveHandler();
    });
  }

  private addBtnSaveHandler(): void {
    const btnSave: HTMLButtonElement = getElement(`[mode="${Mode.Create}"] [type="${ProfileDataBtns.Save}"]`);
    btnSave.addEventListener('click', (e: Event) => this.saveAddressBtnHandler(e));
  }

  private async saveAddressBtnHandler(e: Event): Promise<void> {
    const saveButton = e.target as HTMLButtonElement;
    const formELements = getFormElements(saveButton, ProfileDataCategories.Address);

    if (!formELements) {
      return;
    }

    const newAddressData = createNewBaseAdress(formELements);

    if (!this.authorizedCustomerID || !this.authorizedCustomerVersion) {
      return;
    }

    if (!this.validator.isValidProfileData(saveButton, formELements)) {
      return;
    }

    const actions = [
      {
        action: 'addAddress',
        address: newAddressData,
      },
    ];

    const response = await updateCustomerData(actions);

    if (!response) {
      return;
    }

    const customer = response;
    const newAdress = customer.addresses[customer.addresses.length - 1] || 0;
    const addressID = newAdress.id;

    if (!addressID) {
      return;
    }

    const container = saveButton.closest('.profile-data');
    container?.setAttribute('address-id', `${addressID}`);
    container?.setAttribute('mode', Mode.Edit);

    await this.setCurrentCustomerVersion();
    await updateAddressCategories(addressID);
    await rerenderAddressDetails(this.authorizedCustomerID);

    this.addAddressCheckboxesHandler();

    setNewContainerTitle(getAddressContainerSelector(saveButton), ProfileDataContainersTitles.SavedAddress);

    this.toggleDataEditMode(saveButton);
    await this.rerenderAddressDataBtns(addressID);

    renderPopup(true, PopupMessages.AddressSuccesfullyCreated);
    toggleAddressButtonsDisable(Mode.View);
  }

  public async rerenderAddressDataBtns(addressID: string): Promise<void> {
    const btsContainer: HTMLDivElement = getElement(`[address-id="${addressID}"] .profile-data-btns`);
    btsContainer.innerHTML = '';

    const editBtn = renderEditBtn(btsContainer);
    const removeBtn = renderRemoveBtn(btsContainer);

    editBtn.addEventListener('click', this.btnEditHandler.bind(this));
    removeBtn.addEventListener('click', this.removeAddressBtnHandler.bind(this));
  }

  public addPasswordViewBtnsHandler(): void {
    const passwordBtns: NodeListOf<Element> = getElementCollection('.password-input-btn');
    passwordBtns.forEach((element) => {
      const passwordBtn = element as HTMLButtonElement;
      const container = passwordBtn.closest('.password-data-item__form-item');
      const passwordInput = container?.querySelector('[data-type="password"]') as HTMLInputElement;
      if (!passwordInput) {
        return;
      }

      passwordBtn.addEventListener('click', () => {
        togglePasswordView(passwordInput, passwordBtn);
      });
    });
  }

  private addPasswordSaveBtnHandler(): void {
    const btnSave: HTMLButtonElement = getElement(`.password-data [type="${ProfileDataBtns.Save}"]`);

    btnSave.addEventListener('click', async (e: Event) => {
      e.preventDefault();
      if (!this.authorizedCustomerID) {
        return;
      }
      const succes = await updatePassword(btnSave, this.authorizedCustomerVersion, this.authorizedCustomerID);
      if (succes) {
        await this.setCurrentCustomerVersion();
      }
    });
  }
}

export default ProfileController;
