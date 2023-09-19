import { Cart, ProductProjection } from '@commercetools/platform-sdk';
import generateProductCard from './generateProductCard';
import { createElement, getFromLS } from '../../helpers/functions';
import { getActiveCart } from '../../api';
import ApiClientBuilder from '../../api/buildRoot';

export default async function generateCatalogList(productData: ProductProjection[]): Promise<HTMLElement> {
  let activeCart: Cart | null;

  if (getFromLS('cartID')) {
    const cartResponce = await getActiveCart(ApiClientBuilder.currentRoot);
    if (!(cartResponce instanceof Error)) {
      activeCart = cartResponce;
    }
  } else {
    activeCart = null;
  }

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

      const discount =
        product.masterVariant.prices && product.masterVariant.prices[0] && product.masterVariant.prices[0].discounted
          ? product.masterVariant.prices[0].discounted.value.centAmount / 100
          : price;

      const description = product.description && product.description['en-US'] ? product.description['en-US'] : '';

      const imageUrl =
        product.masterVariant.images && product.masterVariant.images.length > 0
          ? product.masterVariant.images[0].url
          : '';

      const { key = '' } = product;

      let inCart = false;
      let quantity = 1;

      if (activeCart && !(activeCart instanceof Error)) {
        activeCart.lineItems.forEach((item) => {
          if (item.name['en-US'] === product.name['en-US']) {
            inCart = true;
            quantity = item.quantity;
          }
        });
      }

      const productCard = generateProductCard({
        link: product.slug['en-US'],
        title: product.name['en-US'],
        price,
        imageUrl,
        description,
        key,
        discount,
        inCart,
        quantity,
      });

      li.appendChild(productCard);
      catalogList.appendChild(li);
    });
  } else {
    console.error('Product data is not an array');
  }

  return catalogList;
}
