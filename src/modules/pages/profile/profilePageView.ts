import PageView from '../../core/pageView';
import { createElement } from '../../helpers/functions';
import './profilePage.scss';
import { ProfileData, ProfileDataItem } from '../../../types/interfaces';
import { contactData, passwordData, personalData } from './profileItemsData';
import { ProfileDataCategories } from '../../../types/enums';

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

  private renderUserDataContainer(container: HTMLElement, category: string, data: ProfileData): void {
    const dataContainer = createElement({
      tagName: 'div',
      classNames: ['profile-data', `${category}-data`],
      parent: container,
    });

    createElement({
      tagName: 'span',
      text: data.title,
      classNames: ['title', 'profile-data-title'],
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
      parent: dataContainer,
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
        tagName: 'p',
        classNames: [`${category}-data-item__label`, 'profile-data-label'],
        text: item.label,
        parent: dataItem,
      });

      const formItem = createElement({
        tagName: 'div',
        classNames: [`${category}-data-item__form-item`, 'profile-form-item', 'form-item'],
        parent: dataItem,
      });

      const dataItemInput = createElement({
        tagName: 'input',
        classNames: [`${category}-data-item__input`, 'profile-input', 'input'],
        attributes: item.input.attributes,
        parent: formItem,
      });

      dataItemInput.classList.add('profile-input--hidden');
      dataItemInput.disabled = true;
    });

    return container;
  }
}

export default ProfileView;
