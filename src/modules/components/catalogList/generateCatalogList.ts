import generateProductCard from './generateProductCard';
import { ProductCardData } from './productTypes';
import { createElement } from '../../helpers/functions';

export default function generateCatalogList(productData: ProductCardData[]): HTMLElement {
  const catalogList = createElement({
    tagName: 'ol',
    classNames: ['catalog__list'],
  });

  productData.forEach((product) => {
    const li = createElement({
      tagName: 'li',
      classNames: ['catalog__item', 'card'],
    });

    const productCard = generateProductCard(product);
    li.appendChild(productCard);

    catalogList.appendChild(li);
  });

  return catalogList;
}
