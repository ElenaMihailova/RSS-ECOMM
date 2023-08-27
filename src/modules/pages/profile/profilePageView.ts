import PageView from '../../core/pageView';
import { createElement } from '../../helpers/functions';
import './profilePage.scss';
import { ProfileData, ProfileDataItem } from '../../../types/interfaces';
import { contactData, passwordData, personalData } from './profileItemsData';
import { ProfileDataCategories, ProfilePageBtns } from '../../../types/enums';

class ProfileView extends PageView {
  public authorizedCustomerID: string | undefined;

  constructor() {
    super();
    this.container.classList.add('profile-page');
  }

  public render(): HTMLElement {
    const profilePageContainer = createElement({
      tagName: 'div',
      classNames: ['profile-page__container'],
      parent: this.container,
    });

    this.renderPageButtons(profilePageContainer);

    const profilePageContent = createElement({
      tagName: 'div',
      classNames: ['profile-page__content', 'profile-content'],
      parent: profilePageContainer,
    });

    this.renderUserDataContainer(profilePageContent, ProfileDataCategories.Personal, personalData);
    this.renderUserDataContainer(profilePageContent, ProfileDataCategories.Contact, contactData);
    this.renderUserDataContainer(profilePageContent, ProfileDataCategories.Password, passwordData);

    return this.container;
  }

  public async renderUserDataContainer(container: HTMLElement, category: string, data: ProfileData): Promise<void> {
    const dataContainer = createElement({
      tagName: 'div',
      classNames: ['profile-data', `${category}-data`],
      parent: container,
    });

    createElement({
      tagName: 'span',
      text: data.title,
      classNames: ['title', 'profile-data-title', `${category}-data__title`],
      parent: dataContainer,
    });

    const dataForm = createElement({
      tagName: 'form',
      classNames: [`profile-data-form`, `${category}-data-form`],
      parent: dataContainer,
    });

    if (data.dataItems) {
      this.renderDataItems(dataForm, data.dataItems, category);
    }

    createElement({
      tagName: 'button',
      classNames: [`${category}-data__btn-submit`, 'profile-btn-submit'],
      attributes: [{ category: `${category}` }],
      text: data.button,
      parent: dataForm,
    });
  }

  private renderDataItems(container: HTMLElement, data: ProfileDataItem[], category: string): HTMLElement {
    data.forEach((item) => {
      const dataItem = createElement({
        tagName: 'div',
        classNames: [`${category}-data-item`, 'profile-data-item'],
        parent: container,
      });

      createElement({
        tagName: 'label',
        classNames: [`${category}-data-item__label`, 'profile-label'],
        text: item.label,
        parent: dataItem,
      });

      const dataItemInput = createElement({
        tagName: 'input',
        classNames: [`${category}-data-item__input`, 'profile-input', 'input'],
        attributes: item.input.attributes,
        parent: dataItem,
      });

      dataItemInput.classList.add('profile-input--hidden');
      dataItemInput.readOnly = true;
    });

    return container;
  }

  private renderPageButtons(container: HTMLElement): void {
    const btnsContainer = createElement({
      tagName: 'div',
      classNames: ['buttons__content'],
      parent: container,
    });

    const profileBtn = createElement({
      tagName: 'button',
      classNames: ['profile-button'],
      attributes: [{ type: 'button' }],
      text: ProfilePageBtns.Profile,
      parent: btnsContainer,
    });

    const addressesBtn = createElement({
      tagName: 'button',
      classNames: ['addresses-button'],
      attributes: [{ type: 'button' }],
      text: ProfilePageBtns.Addresses,
      parent: btnsContainer,
    });
  }
}

export default ProfileView;
