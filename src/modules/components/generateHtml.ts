import { generateLink } from '../helpers/renderHelpers';
import { NavLink, FooterLinksType } from '../../types/nav.types';
import desktopMenuTemplate from '../templates/DesktopMenuTemplate';
import mobileMenuTemplate from '../templates/MobileMenuModule';
import headerTemplate from '../templates/HeaderTemplate';
import footerTemplate from '../templates/FooterTemplate';

export const createHeader = (navLinks: NavLink[]): string => {
  const linksHtml = navLinks
    .map((link) => {
      return link.href === '#'
        ? `<li><a class='titleMonserrat titleMonserrat--small' onclick="event.preventDefault();" href="${link.href}">${link.text}</a></li>`
        : `<li><a class='titleMonserrat titleMonserrat--small' href="${link.href}">${link.text}</a></li>`;
    })
    .join('');

  const mobilMenuHtml = mobileMenuTemplate(linksHtml);
  const desktopMenuHtml = desktopMenuTemplate(linksHtml);

  return headerTemplate(mobilMenuHtml, desktopMenuHtml);
};

export const createFooter = ({
  collectionLinks = [],
  learnLinks = [],
  customerServiceLinks = [],
}: FooterLinksType): string => {
  const collectionHtml = collectionLinks.map((item) => generateLink(item.text, item.href)).join('');
  const learnHtml = learnLinks.map((item) => generateLink(item.text, item.href)).join('');
  const customerServiceHtml = customerServiceLinks.map((item) => generateLink(item.text, item.href)).join('');

  return footerTemplate(collectionHtml, learnHtml, customerServiceHtml);
};
