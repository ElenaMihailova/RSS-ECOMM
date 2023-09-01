import { createElement } from '../helpers/functions';
import navMenu from './NavMenuModule';
import createMenuUser from './MenuUserDesktop';
import Router from '../router/router';

const desktopMenuTemplate = ({ router }: { router: Router }): HTMLElement => {
  const container = createElement({
    tagName: 'div',
    classNames: ['navbar__menu', 'menu', 'menu--desktop'],
  });

  const menuNavElement = navMenu({ router });
  menuNavElement.classList.add('menu__nav--desktop');
  container.appendChild(menuNavElement);

  const menuUserElement = createMenuUser();
  container.appendChild(menuUserElement);

  return container;
};

export default desktopMenuTemplate;
