import { ProductCardData } from './productTypes';
import { createElement } from '../../helpers/functions';

export default function generateProductCard(productData: ProductCardData): HTMLElement {
  const { link, imageUrl, title, price, description, key, discount } = productData;

  const productCard = createElement({
    tagName: 'a',
    classNames: ['card__link'],
    attributes: [{ 'product-key': key }],
    href: link,
  });

  const imageCard = createElement({
    tagName: 'img',
    classNames: ['card__image'],
    attributes: [{ alt: title }, { src: imageUrl }],
    parent: productCard,
  });

  const nameCard = createElement({
    tagName: 'h2',
    classNames: ['card__name'],
    text: title,
    parent: productCard,
  });

  const descriptionCard = createElement({
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

  const weightCard = createElement({
    tagName: 'p',
    classNames: ['card__weight'],
    text: '50 g',
    parent: priceWrap,
  });

  const priceCard = createElement({
    tagName: 'p',
    classNames: ['card__price'],
    text: `€${price}`,
    parent: priceWrap,
  });

  let discountCard;

  if (typeof discount !== 'undefined' && price !== discount) {
    discountCard = createElement({
      tagName: 'p',
      classNames: ['card__discount'],
      text: `€${discount}`,
      parent: priceWrap,
    });
  }

  return productCard;
}
