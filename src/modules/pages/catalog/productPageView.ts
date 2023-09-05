import { Attribute } from '@commercetools/platform-sdk';
import PageView from '../../core/pageView';
import { createElement } from '../../helpers/functions';
import Router from '../../router/router';
import './productPage.scss';
import { getProduct } from './getProduct';
import { ProductData } from '../../../types/interfaces';

class ProductView extends PageView {
  private router: Router;

  private link: string;

  private product: ProductData | null;

  constructor(router: Router, link: string) {
    super();
    this.router = router;
    this.link = link;
    this.product = null;
  }

  public render(): HTMLElement {
    console.log(this.product);
    const productPageContainer = createElement({
      tagName: 'div',
      classNames: ['product-page__container'],
      parent: this.container,
    });

    getProduct(this.link).then((product) => {
      console.log(product);
      this.renderProductCard(productPageContainer, product);
    });

    return this.container;
  }

  public renderProductCard(container: HTMLDivElement, data: ProductData): void {
    console.log(data);
    const productContainer = createElement({
      tagName: 'div',
      classNames: ['product-page__product-container', 'product-container'],
      parent: container,
    });

    const categoriesContainer = createElement({
      tagName: 'div',
      classNames: ['product-page__categories', 'product-categories'],
      parent: productContainer,
    });

    if (data.categories) {
      this.renderProductCardCategories(categoriesContainer, data.categories);
    }

    const productCard = createElement({
      tagName: 'div',
      classNames: ['product-page__product-card', 'product-card'],
      parent: productContainer,
    });

    const imageContainer = createElement({
      tagName: 'div',
      classNames: ['product-card__image-container', 'image-container'],
      parent: productCard,
    });

    createElement({
      tagName: 'img',
      classNames: ['image-container__image', 'image'],
      attributes: [{ src: data.imageURL }],
      parent: imageContainer,
    });

    const descriptionContainer = createElement({
      tagName: 'div',
      classNames: ['product-card__decription-container', 'product-decription-container'],
      parent: productCard,
    });

    createElement({
      tagName: 'p',
      text: data.title,
      classNames: ['product-decription-container__title', 'title'],
      parent: descriptionContainer,
    });

    createElement({
      tagName: 'p',
      classNames: ['product-description'],
      text: data.description,
      parent: descriptionContainer,
    });

    createElement({
      tagName: 'div',
      classNames: ['line'],
      parent: descriptionContainer,
    });

    const aboutContainer = createElement({
      tagName: 'div',
      classNames: ['product-description__details', 'product-details'],
      parent: descriptionContainer,
    });

    if (data.details) {
      this.renderProductCardDetails(aboutContainer, data.details);
    }

    createElement({
      tagName: 'div',
      classNames: ['line'],
      parent: descriptionContainer,
    });

    const priceContainer = createElement({
      tagName: 'div',
      parent: descriptionContainer,
      classNames: ['product-description__price', 'product-price-container'],
    });

    createElement({
      tagName: 'p',
      classNames: ['product-price-container__price'],
      text: `€ ${data.price}`,
      parent: priceContainer,
    });

    createElement({
      tagName: 'p',
      classNames: ['product-price-container__weight'],
      text: '50 g',
      parent: priceContainer,
    });

    const button = createElement({
      tagName: 'button',
      classNames: ['product-description__button', 'button', 'button--black'],
      text: 'ADD TO BAG',
      parent: descriptionContainer,
    });

    button.disabled = true;
  }

  public renderProductCardCategories(container: HTMLDivElement, categories: string[]): void {
    categories.forEach((category) => {
      createElement({
        tagName: 'li',
        classNames: ['product-categories__category'],
        text: category,
        parent: container,
      });
    });
  }

  public renderProductCardDetails(container: HTMLDivElement, attributes: Attribute[]): void {
    attributes.forEach((attribute) => {
      const detail = createElement({
        tagName: 'li',
        classNames: ['product-details__detail', 'product-detail'],
        parent: container,
      });

      createElement({
        tagName: 'span',
        classNames: ['product-detail__name'],
        text: `${attribute.name}:  `,
        parent: detail,
      });

      createElement({
        tagName: 'span',
        classNames: ['product-detail__value'],
        text: attribute.value[0]['en-US'],
        parent: detail,
      });
    });
  }
}

export default ProductView;
