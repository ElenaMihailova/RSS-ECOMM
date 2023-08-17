interface CatalogItem {
  image: string;
  name: string;
}

export default function createCatalogSection(items: CatalogItem[]): string {
  const itemsMarkup = items
    .map(
      (item) => `
      <li class="catalog__item">
        <img src="${item.image}" width="172" height="172" alt="${item.name}" />
        <h3 class="titleMonserrat titleMonserrat--small">${item.name}</h3>
      </li>
    `,
    )
    .join('');

  return `
      <section class="container catalog">
        <h2 class="titleProstoOne titleProstoOne--big">Our Collections</h2>
        <ul class="catalog__list">
          ${itemsMarkup}
        </ul>
      </section>
    `;
}
