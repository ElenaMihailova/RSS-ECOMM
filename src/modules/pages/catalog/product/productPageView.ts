import { Fancybox, Carousel } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import '@fancyapps/ui/dist/carousel/carousel.css';
import { Attribute, LineItem, ProductProjection } from '@commercetools/platform-sdk';
import PageView from '../../../core/pageView';
import { createElement, getElement, getFromLS, setToLS } from '../../../helpers/functions';
import Router from '../../../router/router';
import './productPage.scss';
import { getProduct } from './getProduct';
import { ProductData } from '../../../../types/interfaces';
import { createCart, getActiveCart, getProductByProductUrl, removeItemFromCart } from '../../../api';
import ApiClientBuilder from '../../../api/buildRoot';
import addProductToCart from './addProductToCart';

class ProductView extends PageView {
  private router: Router;

  private link: string;

  private quantity: number;

  constructor(router: Router, link: string) {
    super();
    this.router = router;
    this.link = link;
    this.quantity = 1;
  }

  public render(): HTMLElement {
    const productPageContainer = createElement({
      tagName: 'div',
      classNames: ['product-page__container'],
      parent: this.container,
    });

    getProduct(this.link)
      .then((product) => {
        this.renderProductCard(productPageContainer, product);
      })
      .then(() => {
        this.amountHandler();
        this.addToCartHandler();
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
      classNames: ['product-decription-container__title'],
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

    const addToCartContainer = createElement({
      tagName: 'div',
      classNames: ['product-description__cart'],
      parent: descriptionContainer,
    });

    const amountContainer = createElement({
      tagName: 'div',
      classNames: ['product-description__amount'],
      parent: addToCartContainer,
    });

    createElement({
      tagName: 'div',
      classNames: ['product-description__minus-button'],
      text: '-',
      parent: amountContainer,
    });

    createElement({
      tagName: 'div',
      classNames: ['product-description__amount-number'],
      text: '1',
      parent: amountContainer,
    });

    createElement({
      tagName: 'div',
      classNames: ['product-description__plus-button'],
      text: '+',
      parent: amountContainer,
    });

    createElement({
      tagName: 'button',
      classNames: ['product-description__add-button', 'button', 'button--black'],
      text: 'ADD TO CART',
      parent: addToCartContainer,
    });

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

  private async amountHandler(): Promise<void> {
    const minusBtn = getElement('.product-description__minus-button');
    const plusBtn = getElement('.product-description__plus-button');
    const amount = getElement('.product-description__amount-number');

    minusBtn.addEventListener('click', (e) => {
      e.preventDefault();
      let currentAmount = 0;
      let newAmount = 1;

      if (amount.textContent) {
        currentAmount = +amount.textContent;
      }

      if (currentAmount > 1) {
        newAmount = currentAmount - 1;
      }

      amount.textContent = newAmount.toString();
      this.quantity = Number(amount.textContent);
    });

    plusBtn.addEventListener('click', (e) => {
      e.preventDefault();
      let currentAmount = 0;
      let newAmount = 0;

      if (amount.textContent) {
        currentAmount = +amount.textContent;
      }

      newAmount = currentAmount + 1;
      amount.textContent = newAmount.toString();
      this.quantity = Number(amount.textContent);
    });
  }

  public async addToCartHandler(): Promise<void> {
    const addBtn: HTMLButtonElement = getElement('.product-description__add-button');
    const addToCartContainer: HTMLDivElement = getElement('.product-description__cart');

    addBtn.textContent = 'ADD TO CART';
    addBtn.removeAttribute('disabled');
    addBtn.classList.remove('inactive');

    const activeCart = await getActiveCart(ApiClientBuilder.currentRoot);

    const product = (await getProductByProductUrl(ApiClientBuilder.currentRoot, this.link)) as ProductProjection;
    const productName = product.name['en-US'];

    if (!(activeCart instanceof Error)) {
      const productToRemove = activeCart.lineItems.filter((item) => item.name['en-US'] === productName);

      if (productToRemove.length) {
        const lineItemId = productToRemove[0].id;
        this.removeFromCartHandler(lineItemId, addBtn, addToCartContainer);
      }
    }

    addBtn.addEventListener('click', async (e: Event): Promise<void> => {
      e.preventDefault();
      if (!getFromLS('cartID')) {
        const cart = await createCart(ApiClientBuilder.currentRoot);
        if (cart instanceof Error) {
          return;
        }
        setToLS('cartID', cart.id);
        setToLS('cartVersion', cart.version.toString());
      }

      await addProductToCart(product, this.quantity);

      const newActiveCart = await getActiveCart(ApiClientBuilder.currentRoot);

      if (newActiveCart instanceof Error) {
        return;
      }

      const addedItem = newActiveCart.lineItems.filter((item) => item.name['en-US'] === product.name['en-US']);

      this.removeFromCartHandler(addedItem[0].id, addBtn, addToCartContainer);
    });
  }

  private async removeFromCartHandler(id: string, btn: HTMLButtonElement, container: HTMLDivElement): Promise<void> {
    // eslint-disable-next-line no-param-reassign
    btn.textContent = 'ADDED';
    btn.setAttribute('disabled', 'disabled');
    btn.classList.add('inactive');

    const removeBtn = createElement({
      tagName: 'button',
      classNames: ['product-description__remove-button', 'button', 'button--black'],
      text: 'REMOVE',
      parent: container,
    });

    removeBtn.addEventListener('click', async () => {
      const cartID = getFromLS('cartID') as string;
      const cartVersion = Number(getFromLS('cartVersion')) || 1;
      const response = await removeItemFromCart(ApiClientBuilder.currentRoot, cartID, cartVersion, id, 1);

      if ('lineItems' in response) {
        const itemsLeft = response.lineItems.filter((item) => item.id === id);

        if (itemsLeft.length) {
          return;
        }

        // eslint-disable-next-line no-param-reassign
        btn.textContent = 'ADD TO CART';
        btn.removeAttribute('disabled');
        btn.classList.remove('inactive');

        removeBtn.remove();
      }
    });
  }
}

export default ProductView;
