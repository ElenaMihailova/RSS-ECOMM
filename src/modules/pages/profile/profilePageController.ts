import { Customer, CustomerChangePassword, CustomerDraft, CustomerUpdate } from '@commercetools/platform-sdk';
import { UpdateAction } from '@commercetools/sdk-client-v2';
import { PageUrls } from '../../../assets/data/constants';
import { getUpdatedCustomer, getUpdatedVersion, changePassword, updateCustomer } from '../../api/apiClient';
import {
  getFromLS,
  getElementCollection,
  renderPopup,
  getElement,
  togglePasswordView,
  getCountryFromCountryCode,
  getCountryCode,
  createElement,
} from '../../helpers/functions';
import Router from '../../router/router';
import Validator from '../../validation/validator';
import {
  FieldNames,
  PopupMessages,
  ProfileDataBtnsTitles,
  ProfileDataBtns,
  ProfileDataCategories,
  AddressCategories,
  Mode,
  ProfileDataContainersTitles,
  CheckboxTypes,
  PasswordTypes,
  InputUserError,
} from '../../../types/enums';
import {
  createError,
  getDateDMYFormatFromIsoString,
  getDateFromString,
  getDateISOStringWithoutTime,
} from '../../validation/validationHelpers';
import ProfileView from './profilePageView';
import { createAddressesData, createNewAddress } from './profileItemsData';
import { BaseAddress, ChangePasswordData, ProfileData } from '../../../types/interfaces';
import {
  clearInputFields,
  createNewBaseAdress,
  getAddressContainerMode,
  getAddressContainerSelector,
  getAddressID,
  getFormElements,
  isAdressCategoryChecked,
  renderErrorResponsePopup,
  renderUpdateSuccesPopup,
  setNewContainerTitle,
  setValueToCountrySelect,
  toggleAddressButtonsDisable,
  toggleAddressCheckboxesView,
  toggleAdressDetailsView,
  toggleBtnEditMode,
  toggleFormElementsEditMode,
} from './profileHelpers';

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

    const data = await getUpdatedCustomer(this.authorizedCustomerID);

    switch (window.location.pathname.slice(1)) {
      case PageUrls.ProfilePageUrl:
        this.addPersonalDataValues(data);
        this.addContactDataValue(data);
        break;
      case `${PageUrls.ProfilePageUrl}/${PageUrls.AddressesPageUrl}`:
        if (data.addresses) {
          const dataAddress = await createAddressesData(this.authorizedCustomerID);

          this.renderAddressContainers(dataAddress);

          await this.addAddressesValues(data);
          await this.addRemoveBtnsHandler();
        }
        this.view.renderAddNewAddressButton();
        await this.addAddAddressBtnHandler();
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

    this.authorizedCustomerVersion = (await getUpdatedVersion(this.authorizedCustomerID)) || 0;
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

    if (!this.isValidData(editButton, formElements)) {
      return;
    }

    const oldCustomerVersion = Number(this.authorizedCustomerVersion);

    await this.updateData(editButton, category, formElements);

    if (!this.isValidData(editButton, formElements)) {
      return;
    }

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

  private async updateData(
    button: HTMLButtonElement,
    category: string,
    formElements: NodeListOf<Element>,
  ): Promise<void> {
    switch (category) {
      case ProfileDataCategories.Personal:
      case ProfileDataCategories.Contact:
        await this.updatePersonalData(formElements);
        break;
      case ProfileDataCategories.Address:
        await this.updateAddressData(formElements, getAddressID(button) as string);
        break;
      default:
    }
  }

  public async addPersonalDataValues(data: Customer): Promise<void> {
    const personalDataElements = getElementCollection('.personal-data-item__element');

    personalDataElements.forEach((element) => {
      const personalDataElement = element as HTMLInputElement;
      switch (personalDataElement.dataset.type) {
        case FieldNames.Name:
          personalDataElement.value = data.firstName || '';
          break;
        case FieldNames.Surname:
          personalDataElement.value = data.lastName || '';
          break;
        case FieldNames.Age:
          personalDataElement.value = getDateDMYFormatFromIsoString(data.dateOfBirth || '') || '';
          break;
        default:
      }
    });
  }

  public async addContactDataValue(data: CustomerDraft): Promise<void> {
    const contactDataElement: HTMLInputElement = getElement('.contact-data-item__element');
    contactDataElement.value = data.email || '';
  }

  private renderAddressContainers(dataAddress: ProfileData[]): void {
    const container: HTMLElement = getElement('.profile-content__addresses');

    dataAddress.forEach((addressData: ProfileData) => {
      this.view.renderUserDataContainer(container, ProfileDataCategories.Address, addressData);
    });
  }

  public async updateCustomerData(actions: UpdateAction[], withoutErrorMessages?: boolean): Promise<Customer | null> {
    if (!this.authorizedCustomerVersion || !this.authorizedCustomerID) {
      return null;
    }

    const updateRequestBody = {
      version: this.authorizedCustomerVersion,
      actions,
    };

    const response = await updateCustomer(this.authorizedCustomerID, updateRequestBody as CustomerUpdate);

    if (response instanceof Error) {
      if (!withoutErrorMessages) {
        renderErrorResponsePopup(ProfileDataCategories.Contact, response);
      }

      return null;
    }

    await this.setCurrentCustomerVersion();

    return response;
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

    const response = await this.updateCustomerData(actions);

    if (!response) {
      return;
    }

    container.remove();
    renderPopup(true, PopupMessages.AddressSuccesfullyRemoved);

    await this.setCurrentCustomerVersion();
  }

  private async addAddAddressBtnHandler(): Promise<void> {
    const addAddressBtn: HTMLButtonElement = getElement(`.profile-content [type="${ProfileDataBtns.Add}"]`);

    addAddressBtn.addEventListener('click', async () => {
      if (!this.authorizedCustomerID) {
        return;
      }

      const dataAddress = await createNewAddress(this.authorizedCustomerID);
      this.renderAddressContainers(dataAddress);
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

    if (!this.isValidData(saveButton, formELements)) {
      return;
    }

    const actions = [
      {
        action: 'addAddress',
        address: newAddressData,
      },
    ];

    const response = await this.updateCustomerData(actions);

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
    await this.updateAddressCategories(addressID);
    await this.rerenderAddressDetails(this.authorizedCustomerID);

    setNewContainerTitle(getAddressContainerSelector(saveButton), ProfileDataContainersTitles.SavedAddress);

    this.toggleDataEditMode(saveButton);
    await this.rerenderAddressDataBtns(addressID);

    renderPopup(true, PopupMessages.AddressSuccesfullyCreated);
    toggleAddressButtonsDisable(Mode.View);
  }

  public async addAddressesValues(data: Customer): Promise<void> {
    const { addresses } = data;

    if (!addresses || !this.authorizedCustomerID) {
      return;
    }

    for await (const address of addresses) {
      const { id } = address;

      if (!id) {
        return;
      }

      const addressDataElements = getElementCollection(`[address-id="${id}"] .address-data-item__element`);

      addressDataElements.forEach((element) => {
        const addressDataElement = element as HTMLInputElement | HTMLSelectElement;

        switch (addressDataElement.dataset.type) {
          case FieldNames.Country:
            setValueToCountrySelect(id, getCountryFromCountryCode(address.country));
            break;
          case FieldNames.City:
            addressDataElement.value = address.city || '';
            break;
          case FieldNames.Street:
            addressDataElement.value = address.streetName || '';
            break;
          case FieldNames.PostalCode:
            addressDataElement.value = address.postalCode || '';
            break;
          default:
        }
      });

      this.setValuesToCheckboxes(data, AddressCategories.Shipping, id);
      this.setValuesToCheckboxes(data, AddressCategories.Billing, id);
    }
  }

  public async updatePersonalData(formELements: NodeListOf<Element>): Promise<void> {
    for await (const element of formELements) {
      const personalDataElement = element as HTMLInputElement;

      const version = this.authorizedCustomerVersion;

      if (!version || !this.authorizedCustomerID) {
        return;
      }

      const { value } = personalDataElement;

      let actions;

      switch (personalDataElement.dataset.type) {
        case FieldNames.Name:
          actions = [
            {
              action: 'setFirstName',
              firstName: value,
            },
          ];
          break;
        case FieldNames.Surname:
          actions = [
            {
              action: 'setLastName',
              lastName: value,
            },
          ];
          break;
        case FieldNames.Age:
          actions = [
            {
              action: 'setDateOfBirth',
              dateOfBirth: getDateISOStringWithoutTime(getDateFromString(value)),
            },
          ];
          break;
        case FieldNames.Email:
          actions = [
            {
              action: 'changeEmail',
              email: value,
            },
          ];
          break;
        default:
      }

      await this.updateCustomerData(actions as UpdateAction[]);
    }
  }

  public async updateAddressData(elements: NodeListOf<Element>, addressID: string): Promise<void> {
    if (!this.authorizedCustomerVersion || !this.authorizedCustomerID) {
      return;
    }

    const updatedAddress: Partial<BaseAddress> = {};

    elements.forEach((element) => {
      const formElement = element as HTMLInputElement | HTMLSelectElement;

      switch (formElement.dataset.type) {
        case FieldNames.Country:
          updatedAddress.country = getCountryCode(formElement.value);
          break;
        case FieldNames.City:
          updatedAddress.city = formElement.value;
          break;
        case FieldNames.Street:
          updatedAddress.streetName = formElement.value;
          break;
        case FieldNames.PostalCode:
          updatedAddress.postalCode = formElement.value;
          break;
        default:
      }
    });

    const actions = [
      {
        action: 'changeAddress',
        addressId: addressID,
        address: updatedAddress as BaseAddress,
      },
    ];

    const responce = await this.updateCustomerData(actions);

    if (!responce) {
      return;
    }

    await this.updateAddressCategories(addressID);
    await this.rerenderAddressDetails(this.authorizedCustomerID);
  }

  public async updateAddressCategories(addressID: string): Promise<void> {
    if (!this.authorizedCustomerVersion || !this.authorizedCustomerID) {
      return;
    }

    const data = await getUpdatedCustomer(this.authorizedCustomerID);

    const { defaultShippingAddressId, defaultBillingAddressId, shippingAddressIds, billingAddressIds } = data;

    const addressesCategoriesCheckboxes = getElementCollection(`[address-id="${addressID}"] [type="checkbox"]`);

    for await (const element of addressesCategoriesCheckboxes) {
      const checkbox = element as HTMLInputElement;
      const category = checkbox.getAttribute('category');
      const type = checkbox.getAttribute('data-type');

      const existsInShipping = shippingAddressIds?.includes(`${addressID}`);
      const existsInBilling = billingAddressIds?.includes(`${addressID}`);
      const defaultShipping = defaultShippingAddressId === addressID;
      const defaultBilling = defaultBillingAddressId === addressID;

      let id = addressID || undefined;
      let action;

      switch (type) {
        case CheckboxTypes.AddressCategory:
          if (category === AddressCategories.Shipping) {
            if (!checkbox.checked && existsInShipping) {
              action = 'removeShippingAddressId';
            } else if (checkbox.checked && !existsInShipping) {
              action = 'addShippingAddressId';
            }
          }

          if (category === AddressCategories.Billing) {
            if (!checkbox.checked && existsInBilling) {
              action = 'removeBillingAddressId';
            } else if (checkbox.checked && !existsInBilling) {
              action = 'addBillingAddressId';
            }
          }
          break;
        case CheckboxTypes.DefaultAddress:
          if (category === AddressCategories.Shipping) {
            if (checkbox.checked && !defaultShipping) {
              action = 'setDefaultShippingAddress';
            } else if (!checkbox.checked && defaultShipping) {
              action = 'setDefaultShippingAddress';
              id = undefined;
            }
          }
          if (category === AddressCategories.Billing) {
            if (checkbox.checked && !defaultBilling) {
              action = 'setDefaultBillingAddress';
            } else if (!checkbox.checked && defaultBilling) {
              action = 'setDefaultBillingAddress';
              id = undefined;
            }
          }
          break;
        default:
      }
      const actions = [
        {
          action,
          addressId: id,
        },
      ];

      await this.updateCustomerData(actions as UpdateAction[], true);
    }
  }

  private setValuesToCheckboxes(data: Customer, category: AddressCategories, addressID: string): void {
    const { defaultBillingAddressId, defaultShippingAddressId, shippingAddressIds, billingAddressIds } = data;

    const currentAddresses = category === AddressCategories.Shipping ? shippingAddressIds : billingAddressIds;
    const currentDefaultAddress =
      category === AddressCategories.Shipping ? defaultShippingAddressId : defaultBillingAddressId;

    const checkboxes = getElementCollection(`[address-id="${addressID}"] .${category}-address-checkboxes .input`);

    checkboxes.forEach((element) => {
      const checkbox = element as HTMLInputElement;
      switch (checkbox.getAttribute('data-type')) {
        case CheckboxTypes.AddressCategory:
          checkbox.checked = Boolean(currentAddresses?.includes(`${addressID}`));
          break;
        case CheckboxTypes.DefaultAddress:
          checkbox.checked = Boolean(currentDefaultAddress === addressID);
          break;
        default:
      }

      toggleAddressCheckboxesView(checkbox);
    });
  }

  public async rerenderAddressDetails(customerID: string): Promise<void> {
    const addressesData = await createAddressesData(customerID);

    const addressContainers = getElementCollection('.profile-data');

    for await (const container of addressContainers) {
      const id = container.getAttribute('address-id');

      const address = addressesData.find((addressData) => addressData.id === id);

      const addressDescriptionContainer: HTMLDivElement = getElement(
        `[address-id="${id}"] .address-description-container`,
      );
      addressDescriptionContainer.innerHTML = '';

      if (id && address?.addressDetails && this.authorizedCustomerID) {
        this.view.renderAddressDescription(addressDescriptionContainer, address?.addressDetails);
        const data = await getUpdatedCustomer(this.authorizedCustomerID);
        this.setValuesToCheckboxes(data, AddressCategories.Shipping, id);
        this.setValuesToCheckboxes(data, AddressCategories.Billing, id);
      }
    }

    this.addAddressCheckboxesHandler();
  }

  public async rerenderAddressDataBtns(addressID: string): Promise<void> {
    const btsContainer: HTMLDivElement = getElement(`[address-id="${addressID}"] .profile-data-btns`);
    btsContainer.innerHTML = '';

    const editBtn = createElement({
      tagName: 'button',
      classNames: [`address-data__btn`, 'profile-data-btn', `profile-data-btn--edit`],
      attributes: [{ category: ProfileDataCategories.Address }, { type: `${ProfileDataBtns.Edit}` }],
      text: ProfileDataBtnsTitles.EditAddress,
      parent: btsContainer,
    });

    const removeBtn = createElement({
      tagName: 'button',
      classNames: [`address-data__btn`, 'profile-data-btn', `profile-data-btn--remove`],
      attributes: [{ category: ProfileDataCategories.Address }, { type: `${ProfileDataBtns.Remove}` }],
      text: ProfileDataBtnsTitles.RemoveAddress,
      parent: btsContainer,
    });

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
      await this.updatePassword(btnSave);
    });
  }

  public createPasswordData(passwordFormElements: NodeListOf<Element>): Partial<ChangePasswordData> {
    const passwordData: Partial<ChangePasswordData> = {};

    passwordFormElements.forEach((element) => {
      const formElement = element as HTMLInputElement;

      switch (formElement.getAttribute('password-type')) {
        case PasswordTypes.CurrentPassword:
          passwordData.currentPassword = formElement.value;
          break;
        case PasswordTypes.NewPassword:
          passwordData.newPassword = formElement.value;
          break;
        case PasswordTypes.NewPasswordConfirm:
          passwordData.newPasswordRepeat = formElement.value;
          break;
        default:
      }
    });

    return passwordData;
  }

  public async updatePassword(button: HTMLButtonElement): Promise<void> {
    if (!this.authorizedCustomerVersion || !this.authorizedCustomerID) {
      return;
    }

    const passwordFormElements = getElementCollection(`[data-type="${FieldNames.Password}"]`);

    if (!passwordFormElements) {
      return;
    }

    const passwordData = this.createPasswordData(passwordFormElements);

    if (!this.isValidData(button, passwordFormElements)) {
      return;
    }

    if (passwordData.newPassword !== passwordData.newPasswordRepeat) {
      const NewPasswordInput: HTMLInputElement = getElement(`[password-type="${PasswordTypes.NewPasswordConfirm}"]`);
      createError(NewPasswordInput, InputUserError.ConfirmPasswordNoMatch);
      renderPopup(false, PopupMessages.NewPasswordsNoMatch);
      return;
    }

    const customerChangePassword: CustomerChangePassword = {
      id: this.authorizedCustomerID,
      version: this.authorizedCustomerVersion,
      currentPassword: passwordData.currentPassword as string,
      newPassword: passwordData.newPassword as string,
    };

    const response = await changePassword(customerChangePassword);

    if (response instanceof Error) {
      renderErrorResponsePopup(ProfileDataCategories.Password, response);
      return;
    }

    renderUpdateSuccesPopup(ProfileDataCategories.Password);
    clearInputFields(passwordFormElements);
    await this.setCurrentCustomerVersion();
  }

  public isValidData(button: HTMLButtonElement, formElements: NodeListOf<Element>): boolean {
    const category = button.getAttribute('category');

    if (!this.validator.validateProfileFormELements(formElements)) {
      renderPopup(false, PopupMessages.ProfileCorrectData);
      return false;
    }

    if (category === ProfileDataCategories.Address) {
      const addressID = getAddressID(button) || undefined;
      if (!isAdressCategoryChecked(addressID)) {
        renderPopup(false, PopupMessages.UnmarkedAdressCategory);
        return false;
      }
    }

    return true;
  }
}

export default ProfileController;
