import PageView from '../../core/pageView';
import { createElement } from '../../helpers/functions';
import './catalogPage.scss';

class CatalogView extends PageView {
  constructor() {
    super();
    this.container.classList.add('catalog-page');
  }

  public render(): HTMLElement {
    const catalogWrapper = createElement({
      tagName: 'div',
      classNames: ['catalog__wrapper'],
      parent: this.container,
    });

    const catalogContainer = createElement({
      tagName: 'div',
      classNames: ['catalog__container'],
      parent: catalogWrapper,
    });

    return this.container;
  }
}

export default CatalogView;
