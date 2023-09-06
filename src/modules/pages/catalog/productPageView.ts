import { Fancybox, Carousel } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import '@fancyapps/ui/dist/carousel/carousel.css';
import { Attribute } from '@commercetools/platform-sdk';
import PageView from '../../core/pageView';
import { createElement, getElement } from '../../helpers/functions';
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
    const productPageContainer = createElement({
      tagName: 'div',
      classNames: ['product-page__container'],
      parent: this.container,
    });

    getProduct(this.link).then((product) => {
      this.renderProductCard(productPageContainer, product);
    });

    return this.container;
  }

  public renderProductCard(container: HTMLDivElement, data: ProductData): void {
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

    this.createImageCarousel(imageContainer, data.imageURLs);

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

    if (data.price !== data.discount) {
      createElement({
        tagName: 'p',
        classNames: ['product-price-container__discount'],
        text: `€ ${data.discount}`,
        parent: priceContainer,
      });
    }

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

    Fancybox.bind('[data-fancybox]', {
      contentClick: 'close',
    });
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

  public createImageCarousel(parentContainer: HTMLDivElement, imageURLs: string[]): void {
    const carouselContainer = createElement({
      tagName: 'div',
      classNames: ['f-carousel'],
      parent: parentContainer,
    });

    imageURLs.forEach((imageURL) => {
      const carouselSlide = createElement({
        tagName: 'div',
        classNames: ['f-carousel__slide'],
        parent: carouselContainer,
      });

      const image = createElement({
        tagName: 'a',
        classNames: ['image-container__image-link'],
        attributes: [{ 'data-fancybox': 'gallery' }, { href: imageURL }],
        parent: carouselSlide,
      });

      createElement({
        tagName: 'img',
        classNames: ['image-container__image', 'image'],
        attributes: [{ src: imageURL }],
        parent: image,
      });
    });

    const container = getElement('.f-carousel');
    if (!container) {
      return;
    }
    const options = { infinite: true };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const carousel = new Carousel(container as HTMLElement, options);
  }
}

export default ProductView;
