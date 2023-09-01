import PageView from '../../core/pageView';
import { createElement } from '../../helpers/functions';

class ProductView extends PageView {
  constructor() {
    super();
    this.container.classList.add('product-page');
  }

  public render(): HTMLElement {
    const productPageWrapper = createElement({
      tagName: 'div',
      classNames: ['product-page__wrapper'],
      parent: this.container,
    });

    const productPageContainer = createElement({
      tagName: 'div',
      classNames: ['product-page__container'],
      parent: productPageWrapper,
    });

    this.productRender(productPageContainer);
    this.aboutRender(productPageContainer);
    this.otherRender(productPageContainer);

    return this.container;
  }

  private productRender(container: HTMLElement): HTMLElement {
    const productContainer = createElement({
      tagName: 'div',
      classNames: ['product__container'],
      parent: container,
    });

    createElement({
      tagName: 'div',
      classNames: ['product__image-container'],
      parent: productContainer,
    });

    const productInfoContainer = createElement({
      tagName: 'div',
      classNames: ['product__info-container'],
      parent: productContainer,
    });

    createElement({
      tagName: 'p',
      classNames: ['product__name'],
      parent: productInfoContainer,
    });

    const productAttributesContainer = createElement({
      tagName: 'div',
      classNames: ['product__attr-container'],
      parent: productContainer,
    });

    const productOriginContainer = createElement({
      tagName: 'div',
      classNames: ['product__origin-container'],
      parent: productAttributesContainer,
    });

    const productFlavorContainer = createElement({
      tagName: 'div',
      classNames: ['product__flavor-container'],
      parent: productAttributesContainer,
    });

    createElement({
      tagName: 'div',
      classNames: ['product__origin-icon'],
      // html: createSvgElement('password-icon', 'login-password-icon'),
      parent: productOriginContainer,
    });

    createElement({
      tagName: 'div',
      classNames: ['product__flavor-icon'],
      // html: createSvgElement('password-icon', 'login-password-icon'),
      parent: productFlavorContainer,
    });

    const productPrice = createElement({
      tagName: 'p',
      classNames: ['product__price'],
      parent: productContainer,
    });

    const productVariantsContainer = createElement({
      tagName: 'div',
      classNames: ['product__variants-container'],
      parent: productContainer,
    });

    createElement({
      tagName: 'p',
      classNames: ['product__variant-title'],
      parent: productVariantsContainer,
    });

    const productVariant = createElement({
      tagName: 'div',
      classNames: ['product__variant'],
      parent: productVariantsContainer,
    });

    createElement({
      tagName: 'div',
      classNames: ['product__variant-icon'],
      // html: createSvgElement('password-icon', 'login-password-icon'),
      parent: productVariant,
    });

    createElement({
      tagName: 'p',
      classNames: ['product__variant-text'],
      text: '50 g bag',
      parent: productVariant,
    });

    const productButtonContainer = createElement({
      tagName: 'div',
      classNames: ['product__button-container'],
      parent: productContainer,
    });

    createElement({
      tagName: 'div',
      classNames: ['product__amount-container'],
      text: '- 1 +',
      parent: productButtonContainer,
    });

    createElement({
      tagName: 'button',
      classNames: ['product__add-button'],
      text: 'ADD TO BAG',
      parent: productButtonContainer,
    });

    return productContainer;
  }

  private aboutRender(container: HTMLElement): HTMLElement {
    const aboutContainer = createElement({
      tagName: 'div',
      classNames: ['about__container'],
      parent: container,
    });

    createElement({
      tagName: 'p',
      classNames: ['about__title'],
      text: 'About this tea',
      parent: aboutContainer,
    });

    createElement({
      tagName: 'p',
      classNames: ['about_text'],
      parent: aboutContainer,
    });

    return aboutContainer;
  }

  private otherRender(container: HTMLElement): HTMLElement {
    const otherContainer = createElement({
      tagName: 'div',
      classNames: ['other__container'],
      parent: container,
    });

    createElement({
      tagName: 'p',
      classNames: ['other__title'],
      text: 'You may also like',
      parent: otherContainer,
    });

    createElement({
      tagName: 'div',
      classNames: ['other__products-container'],
      parent: otherContainer,
    });

    return otherContainer;
  }
}

export default ProductView;
