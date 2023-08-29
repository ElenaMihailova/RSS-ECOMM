import generateProductCard from './generateProductCard';
import { ProductCardData } from './productTypes';

export default function generateCatalogList(productData: ProductCardData[]): string {
  const productCards = productData
    .map(
      (product) => `
  <li class="catalog__item card">${generateProductCard(product)}</li>`,
    )
    .join('');

  return `
  <ol class='catalog__list'>
  ${productCards}
  </ol>
`;
}
