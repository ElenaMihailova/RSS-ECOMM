import { BreadcrumbItem } from './breadcrumbItem';
import { createElement } from '../../helpers/functions';

function generateBreadcrumbs(links: BreadcrumbItem[]): HTMLElement {
  const breadcrumbsNav = createElement({
    tagName: 'nav',
    attributes: [{ 'aria-label': 'breadcrumbs' }],
    classNames: ['breadcrumbs', 'container'],
  });

  const breadcrumbsList = createElement({
    tagName: 'ol',
    classNames: ['breadcrumbs__list'],
  });

  links.forEach((link, index) => {
    const listItem = createElement({
      tagName: 'li',
      classNames: ['breadcrumbs__link'],
    });

    if (!link.href) {
      listItem.innerText = link.text;
    } else {
      const anchor = createElement({
        tagName: 'a',
        classNames: ['breadcrumbs__link'],
        attributes: [{ href: link.href }],
        text: link.text,
      });

      listItem.appendChild(anchor);
    }

    breadcrumbsList.appendChild(listItem);

    if (index !== links.length - 1) {
      const separator = createElement({
        tagName: 'li',
        text: '/',
      });

      breadcrumbsList.appendChild(separator);
    }
  });

  breadcrumbsNav.appendChild(breadcrumbsList);

  return breadcrumbsNav;
}

export default generateBreadcrumbs;
