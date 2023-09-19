import { Attribute } from '@commercetools/platform-sdk';
import PageView from '../../core/pageView';
import Router from '../../router/router';
import { MainData } from '../../../types/interfaces';
import { removeItemFromCart } from '../../api/apiCart';
import {
  createElement,
  getElement,
  getFromLS,
  renderPopup,
  setToLS,
  updateCartCommonQuantity,
} from '../../helpers/functions';
import ApiClientBuilder from '../../api/buildRoot';
import { PopupMessages } from '../../../types/enums';

class BasketView extends PageView {
  private title: string;

  private content: string;

  constructor(basketData: MainData) {
    super();
    this.title = basketData.title;
    this.content = basketData.content instanceof HTMLDivElement ? basketData.content.outerHTML : basketData.content;
  }

  private insertMainInDOM(): void {
    const footer = document.querySelector('footer');
    if (footer) {
      footer.insertAdjacentElement('beforebegin', this.container);
    } else {
      document.body.appendChild(this.container);
    }
  }

  public clearContent(): void {
    this.container.innerHTML = '';
  }

  public render(): HTMLElement {
    const contentContainer = document.createElement('div');
    contentContainer.innerHTML = `
      <h1 class="visually-hidden">${this.title}</h1>
      ${this.content}
    `;
    return contentContainer;
  }

  public setContent(content: PageView): void {
    const contentContainer = document.createElement('div');
    contentContainer.append(content.render());
    this.container.appendChild(contentContainer);
    this.insertMainInDOM();
  }
}

export default BasketView;
