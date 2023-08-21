import { NavLink, FooterLinksType } from '../../types/nav.types';
import { addHTML } from '../helpers/renderHelpers';
import { createFooter, createHeader } from './generateHtml';

const createLayout = (
  headerData: NavLink[],
  footerData: FooterLinksType,
): { header: HTMLElement; footer: HTMLElement } => {
  const headerHtml = createHeader(headerData);
  const footerHtml = createFooter(footerData);

  addHTML('header', ['header'], headerHtml);
  addHTML('footer', ['footer'], footerHtml);

  const header = addHTML('header', ['header'], headerHtml);
  const footer = addHTML('footer', ['footer'], footerHtml);

  return { header, footer };
};

export default createLayout;
