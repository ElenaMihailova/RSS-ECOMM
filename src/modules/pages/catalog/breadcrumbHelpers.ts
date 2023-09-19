import { createElement, getElement, getElementCollection } from '../../helpers/functions';

export const getBreadcrumbClassLink = (link: string): string => link.split(' ')[0].toLowerCase();

export const createBreadcrumbLink = (parent: HTMLElement, link: string, classLink: string): HTMLAnchorElement => {
  createElement({
    tagName: 'span',
    text: '/',
    parent,
  });

  const breadcrumbItem = createElement({
    tagName: 'li',
    classNames: ['breadcrumbs__link'],
    parent,
  });

  const breadcrumbLink = createElement({
    tagName: 'a',
    classNames: ['breadcrumbs__link', `breadcrumbs__${classLink}-link`],
    text: `${link.toUpperCase()}`,
    parent: breadcrumbItem,
  });

  return breadcrumbLink;
};

export const removeBreadcrumbLinks = (breadcrumbList: HTMLElement, min: number): void => {
  const items = breadcrumbList.children;

  for (let i = items.length - 1; i >= 0; i -= 1) {
    if (i <= min) {
      break;
    }
    breadcrumbList.removeChild(items[i]);
  }
};

export const removeActiveBreadcrumbLinks = (): void => {
  const allLinks = getElementCollection('.category__link');

  allLinks.forEach((link) => {
    if (link.classList.contains('active')) {
      link.classList.remove('active');
    }
  });
};

export const setActiveBreadcrumbLink = (classLink: string): void => {
  const category = getElement(`.category-${classLink}__link`);
  category.classList.add('active');
};
