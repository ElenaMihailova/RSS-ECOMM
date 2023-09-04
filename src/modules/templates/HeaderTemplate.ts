
import { createElement, createSvg } from '../helpers/functions';

const headerTemplate = (mobilMenu: HTMLElement, desktopMenu: HTMLElement): HTMLElement => {
  const headerWrapper = createElement({
    tagName: 'div',
    classNames: ['header__wrapper'],
  });

  const logoDiv = createElement({
    tagName: 'div',
    classNames: ['header__logo', 'logo'],
    parent: headerWrapper,
  });

  const logoLink = createElement({
    tagName: 'a',
    classNames: ['logo__link'],
    href: 'index',
    parent: logoDiv,
  });

  const svgElement = createSvg({
    tagName: 'svg',
    classNames: ['logo__img'],
    attributes: {
      width: '24',
      height: '24',
      viewBox: '0 0 24 25',
      ariaLabel: 'Logo.',
    },
    parent: logoLink,
  });

  const useElement = createSvg({
    tagName: 'use',
    attributes: {
      xlinkHref: './image/sprite.svg#logo',
    },
    parent: svgElement,
  });

  const logoText = createElement({
    tagName: 'span',
    text: 'Brand Name',
    parent: logoLink,
  });

  const navbar = createElement({
    tagName: 'nav',
    classNames: ['navbar'],
    parent: headerWrapper,
  });

  navbar.appendChild(mobilMenu);
  navbar.appendChild(desktopMenu);

  return headerWrapper;
};

export default headerTemplate;
