import generateLink from '../helpers/renderHelpers';
import { NavLink, FooterLinks } from './layout/nav.types';
import desktopMenuTemplate from '../templates/DesktopMenuTemplate';
import mobileMenuTemplate from '../templates/MobileMenuModule';
import headerTemplate from '../templates/HeaderTemplate';
import footerTemplate from '../templates/FooterTemplate';
import { createElement } from '../helpers/functions';
import Router from '../router/router';

export const createHeader = (navLinks: NavLink[], router: Router): HTMLElement => {
  const ul = createElement({
    tagName: 'ul',
  });

  navLinks.forEach((link) => {
    const li = createElement({
      tagName: 'li',
    });

    const a = createElement({
      tagName: 'a',
      classNames: ['titleMonserrat', 'titleMonserrat--small'],
      href: link.href,
      text: link.text,
    });

    if (link.href === '#') {
      a.classList.add('no-active');
      a.addEventListener('click', (e) => e.preventDefault());
    }

    li.appendChild(a);
    ul.appendChild(li);
  });

  const mobilMenu = mobileMenuTemplate({ router });
  const desktopMenu = desktopMenuTemplate({ router });

  return headerTemplate(mobilMenu, desktopMenu);
};

export const createFooter = ({
  collectionLinks = [],
  learnLinks = [],
  customerServiceLinks = [],
}: FooterLinks): string => {
  const collectionHtml = collectionLinks.map((item) => generateLink(item.text, item.href)).join('');
  const learnHtml = learnLinks.map((item) => generateLink(item.text, item.href)).join('');
  const customerServiceHtml = customerServiceLinks.map((item) => generateLink(item.text, item.href)).join('');

  return footerTemplate(collectionHtml, learnHtml, customerServiceHtml);
};
