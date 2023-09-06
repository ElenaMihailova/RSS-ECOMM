import { createElement } from '../../helpers/functions';

function generateBreadcrumbs(): HTMLElement {
  const breadcrumbsNav = createElement({
    tagName: 'nav',
    attributes: [{ 'aria-label': 'breadcrumbs' }],
    classNames: ['breadcrumbs', 'container'],
  });

  const breadcrumbsList = createElement({
    tagName: 'ol',
    classNames: ['breadcrumbs__list'],
    parent: breadcrumbsNav,
  });

  const homeItem = createElement({
    tagName: 'li',
    classNames: ['breadcrumbs__link'],
    parent: breadcrumbsList,
  });

  createElement({
    tagName: 'a',
    classNames: ['breadcrumbs__link', 'breadcrumbs__home-link'],
    text: 'HOME',
    parent: homeItem,
  });

  createElement({
    tagName: 'span',
    text: '/',
    parent: breadcrumbsList,
  });

  const catalogItem = createElement({
    tagName: 'li',
    classNames: ['breadcrumbs__link'],
    parent: breadcrumbsList,
  });

  createElement({
    tagName: 'a',
    classNames: ['breadcrumbs__link', 'breadcrumbs__catalog-link'],
    text: 'TEA COLLECTIONS',
    parent: catalogItem,
  });

  return breadcrumbsNav;
}

export default generateBreadcrumbs;
