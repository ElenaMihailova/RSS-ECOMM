import { footerLinks, headerLinks } from './assets/data/navigationData';
import createLayout from './modules/pages/layout/createLayout';

import './index.scss';
import setupMenuToggle from './modules/helpers/setupMenuToggle';
import renderMain from './modules/pages/main/renderMain';
import mainContent from './modules/templates/mainContent';

function initApp(): void {
  createLayout(headerLinks, footerLinks);
  setupMenuToggle('hamburger', 'menu');
  renderMain(mainContent);
}

initApp();
