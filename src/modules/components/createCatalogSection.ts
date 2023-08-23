interface CatalogItem {
  image: string;
  name: string;
}

export default function createCatalogSection(items: CatalogItem[]): string {
  const itemsMarkup = items
    .map(
      (item) => `
      <li class="catalog__item">
        <a href="javascript:void(0)" class="catalog__link titleMonserrat titleMonserrat--small">
          <img src="${item.image}" width="172" height="172" alt="${item.name}" />
          <h3>${item.name}</h3>
        </a>
      </li>
    `,
    )
    .join('');

  return `
      <section class="container catalog" id="tea_collections">
        <h2 class="titleProstoOne titleProstoOne--big">Our Collections</h2>
        <ul class="catalog__list">
          ${itemsMarkup}
        </ul>
      </section>
    `;
}
