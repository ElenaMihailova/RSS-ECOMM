import { footerLinks, headerLinks } from './assets/data/navigationData';
import createLayout from './modules/pages/createLayout';

import './index.scss';
import setupMenuToggle from './modules/helpers/setupMenuToggle';

function initApp(): void {
  createLayout(headerLinks, footerLinks);
  setupMenuToggle('hamburger', 'menu');
}

initApp();
