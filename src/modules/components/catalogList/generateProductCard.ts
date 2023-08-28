import { ProductCardData } from './productTypes';

export default function generateProductCard({ link, image, title, price }: ProductCardData): string {
  return `
  <a class="product-card" href="${link}">
    <img src="${image}" alt="${title}" class="product-card__image"  />
    <h2 class="product-card__name">${title}</h2>
    <p class="product-card__price">${price} ₽</p>
  </a>
  `;
}
