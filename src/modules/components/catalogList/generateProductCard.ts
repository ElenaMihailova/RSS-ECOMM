import { ProductCardData } from './productTypes';
import { createElement, createSvg } from '../../helpers/functions';

export default function generateProductCard(productData: ProductCardData): HTMLElement {
  const { link, imageUrl, title, price, description, key, discount, inCart, quantity } = productData;

  const productCard = createElement({
    tagName: 'a',
    classNames: ['card__link'],
    attributes: [{ 'product-key': key }],
    href: link,
  });

  createElement({
    tagName: 'img',
    classNames: ['card__image'],
    attributes: [{ alt: title }, { src: imageUrl }],
    parent: productCard,
  });

  createElement({
    tagName: 'h2',
    classNames: ['card__name'],
    text: title,
    parent: productCard,
  });

  createElement({
    tagName: 'p',
    classNames: ['card__description'],
    text: description,
    parent: productCard,
  });

  const priceWrap = createElement({
    tagName: 'div',
    classNames: ['card__price-wrap'],
    parent: productCard,
  });

  createElement({
    tagName: 'p',
    classNames: ['card__weight'],
    text: '50 g',
    parent: priceWrap,
  });

  createElement({
    tagName: 'p',
    classNames: ['card__price'],
    text: `€${price}`,
    parent: priceWrap,
  });

  if (typeof discount !== 'undefined' && price !== discount) {
    createElement({
      tagName: 'p',
      classNames: ['card__discount'],
      text: `€${discount}`,
      parent: priceWrap,
    });
  }

  const cartWrap = createElement({
    tagName: 'div',
    classNames: ['card__cart-wrap', 'cart-wrap'],
    parent: productCard,
  });

  const quantityContainer = createElement({
    tagName: 'div',
    classNames: ['cart-wrap__quantity-container', 'quantity-container'],
    parent: cartWrap,
  });

  const minusBtn = createElement({
    tagName: 'button',
    classNames: ['quantity-container__button', 'minus-button'],
    attributes: [{ disabled: 'true' }],
    text: '-',
    parent: quantityContainer,
  });

  const quantityElement = createElement({
    tagName: 'div',
    classNames: ['quantity-container__quantity'],
    text: quantity?.toString() || '1',
    parent: quantityContainer,
  });

  const plusBtn = createElement({
    tagName: 'button',
    classNames: ['quantity-container__button', 'plus-button'],
    text: '+',
    parent: quantityContainer,
  });

  const addToCartBtn = createElement({
    tagName: 'button',
    classNames: ['cart-wrap__add-to-cart-button', 'add-to-cart-button'],
    parent: cartWrap,
  });

  const svg = createSvg({
    tagName: 'svg',
    attributes: {
      width: '24',
      height: '24',
      viewBox: '0 0 24 24',
      'aria-hidden': 'false',
      fill: '#000000',
    },
    parent: addToCartBtn,
  });

  createSvg({
    tagName: 'use',
    attributes: { href: '../image/sprite.svg#cart' },
    parent: svg,
  });

  if (inCart) {
    minusBtn.disabled = true;
    plusBtn.disabled = true;
    addToCartBtn.disabled = true;
    quantityElement.classList.add('disabled-text');
  }

  return productCard;
}
