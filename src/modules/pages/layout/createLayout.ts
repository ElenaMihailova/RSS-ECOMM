import { NavLink, FooterLinksType } from '../../../types/nav.types';
import { addHTML } from '../../helpers/renderHelpers';
import { createFooter, createHeader } from '../../components/generateHtml';

const createLayout = (headerData: NavLink[], footerData: FooterLinksType): void => {
  const headerHtml = createHeader(headerData);
  const footerHtml = createFooter(footerData);

  addHTML('header', ['header'], headerHtml);
  addHTML('footer', ['footer'], footerHtml);
};

export default createLayout;
