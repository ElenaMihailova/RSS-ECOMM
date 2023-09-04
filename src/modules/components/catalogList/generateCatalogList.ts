import generateProductCard from './generateProductCard';
import { createElement } from '../../helpers/functions';
import { getProductProjections } from '../../api/apiClient';

export default async function generateCatalogList(): Promise<HTMLElement> {
  try {
    const productData = await getProductProjections();

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

        const description = product.description && product.description['en-US'] ? product.description['en-US'] : '';

        const imageUrl =
          product.masterVariant.images && product.masterVariant.images.length > 0
            ? product.masterVariant.images[0].url
            : '';

        let key = '';
        if (product.key) {
          key = product.key;
        }

        const productCard = generateProductCard({
          link: product.slug['en-US'],
          title: product.name['en-US'],
          price,
          imageUrl,
          description,
          key,
        });

        li.appendChild(productCard);
        catalogList.appendChild(li);
      });
    } else {
      console.error('Product data is not an array');
    }

    return catalogList;
  } catch (error) {
    console.error();
    throw error;
  }
}
