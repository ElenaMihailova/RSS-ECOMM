import { ProductCardData } from './productTypes';

export default function generateProductCard({ link, image, title, price }: ProductCardData): string {
  return `
  <a class="card__link" href="${link}">
    <img src="${image}" alt="${title}" class="product-card__image"  />
    <h2 class="card__name">${title}</h2>
    <div>    <p class="card__price">${price} ₽</p>
    <p class="card__weight">50 <span>g</span></p></div>
  </a>
  `;
}
