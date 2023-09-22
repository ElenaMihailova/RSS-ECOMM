import { createElement } from '../helpers/functions';
import MenuUser from './MenuUserModule';
import navMenu from './NavMenuModule';
import Router from '../router/router';

const mobileMenuTemplate = ({ router }: { router: Router }): HTMLElement => {
  const container = createElement({
    tagName: 'div',
    classNames: ['navbar__mobil'],
  });

  const innerContainer = createElement({
    tagName: 'div',
    classNames: ['navbar__container'],
    parent: container,
  });

  createElement({
    tagName: 'input',
    attributes: [{ type: 'checkbox' }, { id: 'hamburger' }],
    classNames: ['hamburger'],
    parent: innerContainer,
  });

  const hamburgerLines = createElement({
    tagName: 'div',
    classNames: ['hamburger__lines'],
    parent: innerContainer,
  });

  createElement({ tagName: 'span', classNames: ['line1'], parent: hamburgerLines });
  createElement({ tagName: 'span', classNames: ['line2'], parent: hamburgerLines });
  createElement({ tagName: 'span', classNames: ['line3'], parent: hamburgerLines });

  const wrapper = createElement({
    tagName: 'div',
    classNames: ['navbar__wrapper', 'menu'],
    attributes: [{ id: 'menu' }],
    parent: innerContainer,
  });

  const menuUserElement = MenuUser();
  wrapper.appendChild(menuUserElement);

  const menuNavElement = navMenu({ router });
  wrapper.appendChild(menuNavElement);
  return container;
};

export default mobileMenuTemplate;
