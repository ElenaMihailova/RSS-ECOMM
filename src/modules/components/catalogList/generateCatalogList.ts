import { ProductProjection } from '@commercetools/platform-sdk';
import generateProductCard from './generateProductCard';
import { createElement } from '../../helpers/functions';

export default function generateCatalogList(productData: ProductProjection[]): HTMLElement {
  const catalogList = createElement({
    tagName: 'ol',
    classNames: ['catalog__list', 'catalog__list--catalog'],
  });

  if (Array.isArray(productData)) {
    productData.forEach((product) => {
      const li = createElement({
        tagName: 'li',
        classNames: ['catalog__item', 'card'],
      });

      const price =
        product.masterVariant.prices && product.masterVariant.prices[0]
          ? product.masterVariant.prices[0].value.centAmount / 100
          : 0;

      const imageUrl =
        product.masterVariant.images && product.masterVariant.images.length > 0
          ? product.masterVariant.images[0].url
          : '';

      const { key = '' } = product;

      const productCard = generateProductCard({
        link: product.slug['en-US'],
        title: product.name['en-US'],
        price,
        imageUrl,
        key,
      });

      li.appendChild(productCard);
      catalogList.appendChild(li);
    });
  } else {
    console.error('Product data is not an array');
  }

  return catalogList;
}
