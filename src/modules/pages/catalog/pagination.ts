import { ProductProjection } from '@commercetools/platform-sdk';
import { getElement, getFromLS, setToLS } from '../../helpers/functions';

export const paginationLimit = 6;

export const getCurrentPage = (): string => {
  return getFromLS('currentPage') || '1';
};

export const setCurrentPage = (page: number): void => {
  setToLS('currentPage', page.toString());
};

const pageCount = (allProducts: number): number => {
  return Math.ceil(allProducts / paginationLimit);
};

export const getProductsOnPage = (products: ProductProjection[]): ProductProjection[] => {
  const pageNum = Number(getCurrentPage());

  const prevRange = (pageNum - 1) * paginationLimit;
  const currRange = pageNum * paginationLimit;

  const productsOnPage: ProductProjection[] = [];

  products.forEach((item, index) => {
    if (index >= prevRange && index < currRange) {
      productsOnPage.push(item);
    }
  });

  return productsOnPage;
};

export const resetPage = (): void => {
  const btnPrev: HTMLButtonElement = getElement('.prev-button');
  const btnNext: HTMLButtonElement = getElement('.next-button');
  const pageNumElement: HTMLDivElement = getElement('.pagination__page-number');

  pageNumElement.textContent = '1';
  setToLS('currentPage', '1');
  btnPrev.disabled = true;
  btnNext.disabled = false;
};

export const disablePaginationBtns = (pagesNum: number): void => {
  const btnPrev: HTMLButtonElement = getElement('.prev-button');
  const btnNext: HTMLButtonElement = getElement('.next-button');
  const pageNumElement: HTMLDivElement = getElement('.pagination__page-number');
  const currentPage = Number(pageNumElement.textContent);

  if (pagesNum <= 1) {
    btnNext.disabled = true;
    btnPrev.disabled = true;
    pageNumElement.textContent = pagesNum.toString();
    return;
  }

  if (currentPage > 1 && currentPage < pagesNum) {
    btnNext.disabled = false;
    btnPrev.disabled = false;
    return;
  }

  btnNext.disabled = currentPage >= pagesNum;
  btnPrev.disabled = currentPage <= 1;
};

export default pageCount;
