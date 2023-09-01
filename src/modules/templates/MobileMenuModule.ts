import { createElement, createSvg } from '../helpers/functions';
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

  const inputCheckbox = createElement({
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

  createElement({ tagName: 'span', classNames: ['line', 'line1'], parent: hamburgerLines });
  createElement({ tagName: 'span', classNames: ['line', 'line2'], parent: hamburgerLines });
  createElement({ tagName: 'span', classNames: ['line', 'line3'], parent: hamburgerLines });

  const wrapper = createElement({
    tagName: 'div',
    classNames: ['navbar__wrapper', 'menu'],
    attributes: [{ id: 'menu' }],
    parent: innerContainer,
  });

  const inputWrap = createElement({
    tagName: 'div',
    classNames: ['input', 'input--icon'],
    parent: wrapper,
  });

  const input = createElement({
    tagName: 'input',
    attributes: [{ type: 'text' }, { id: 'search' }, { placeholder: 'SEARCH PRODUCTS' }],
    parent: inputWrap,
  });

  const label = createElement({
    tagName: 'label',
    attributes: [{ for: 'search' }],
    parent: inputWrap,
  });

  const svgElement = createSvg({
    tagName: 'svg',
    attributes: {
      width: '24',
      height: '24',
      viewBox: '0 0 24 24',
      'aria-hidden': 'true',
    },
    parent: label,
  });

  createSvg({
    tagName: 'use',
    attributes: {
      xlinkHref: './image/sprite.svg#search',
    },
    parent: svgElement,
  });

  const menuUserElement = MenuUser();
  wrapper.appendChild(menuUserElement);

  const menuNavElement = navMenu({ router });
  wrapper.appendChild(menuNavElement);
  return container;
};

export default mobileMenuTemplate;
