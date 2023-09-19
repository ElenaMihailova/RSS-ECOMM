import { getElement, getElementCollection } from '../../helpers/functions';

export const displayProductsSubcategory = (category: Element): void => {
  const categories = getElementCollection('.subcategory__item');

  categories.forEach((cat) => {
    const categoryHtml = cat as HTMLAnchorElement;
    categoryHtml.classList.add('visually-hidden');
  });

  if (category.classList.contains('visually-hidden')) {
    category.classList.remove('visually-hidden');
  } else {
    category.classList.add('visually-hidden');
  }
};

export const hideProductsSubcategories = (): void => {
  const categories = getElementCollection('.subcategory__item');

  categories.forEach((cat) => {
    const categoryHtml = cat as HTMLAnchorElement;
    categoryHtml.classList.add('visually-hidden');
  });
};

export const clearSearchInput = (): void => {
  const searchInput: HTMLInputElement = getElement('.search__input');
  searchInput.value = '';
};
