import { NavLink, FooterLinks } from './nav.types';
import { createFooter, createHeader } from '../generateHtml';
import { createElement } from '../../helpers/functions';
import Router from '../../router/router';

const createLayout = (
  headerData: NavLink[],
  footerData: FooterLinks,
  router: Router,
): { header: HTMLElement; footer: HTMLElement } => {
  const headerHtml = createHeader(headerData, router);
  const footerHtml = createFooter(footerData);

  const header = createElement({
    tagName: 'header',
    classNames: ['header'],
  });
  header.appendChild(headerHtml);

  const footer = createElement({
    tagName: 'footer',
    classNames: ['footer'],
    html: footerHtml,
  });

  return { header, footer };
};

export default createLayout;
