import { ProductCardData } from './productTypes';
import { createElement } from '../../helpers/functions';

export default function generateProductCard({ link, title, price }: ProductCardData): HTMLElement {
  const productCard = createElement({
    tagName: 'a',
    classNames: ['card__link'],
    href: link,
  });

  const imageCard = createElement({
    tagName: 'img',
    classNames: ['product-card__image'],
    attributes: [{ alt: title, src: '' }],
  });

  const nameCard = createElement({
    tagName: 'h2',
    classNames: ['card__name'],
    text: title,
  });

  const priceWrap = createElement({
    tagName: 'div',
  });

  const priceCard = createElement({
    tagName: 'p',
    classNames: ['card__price'],
    text: `${price} ₽`,
  });

  const weightCard = createElement({
    tagName: 'p',
    classNames: ['card__weight'],
    text: '50 g',
  });

  const weightUnit = createElement({
    tagName: 'span',
  });

  weightCard.appendChild(weightUnit);

  priceWrap.appendChild(priceCard);
  priceWrap.appendChild(weightCard);

  productCard.appendChild(imageCard);
  productCard.appendChild(nameCard);
  productCard.appendChild(priceWrap);

  return productCard;
}
