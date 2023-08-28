import generateProductCard from './generateProductCard';
import { ProductCardData } from './productTypes';

export default function generateCatalogList(productData: ProductCardData[]): string {
  const productCards = productData
    .map(
      (product) => `
  <li class="catalog__item">${generateProductCard(product)}</li>`,
    )
    .join('');

  return `<section class="container">
  <ol class='catalog__list'>
  ${productCards}
  </ol>
</section>`;
}
