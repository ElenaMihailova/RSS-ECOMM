import { createElement, createSvg } from '../helpers/functions';

const createMenuUser = (): HTMLElement => {
  const menuItems = [
    {
      href: '#',
      svgHref: './image/sprite.svg#search',
      text: 'Search',
    },
    {
      href: '#',
      svgHref: './image/sprite.svg#card',
      text: 'Card',
    },
    {
      href: 'registration',
      classNames: ['registration', 'registration--desktop'],
      svgHref: './image/sprite.svg#add_person',
      text: 'Sign up',
    },
    {
      href: 'login',
      classNames: ['login', 'login--desktop'],
      svgHref: './image/sprite.svg#person',
      extraSvgHref: './image/sprite.svg#logout',
      text: 'Log in',
    },
  ];

  const ul = createElement({
    tagName: 'ul',
    classNames: ['menu__user', 'menu__user--desktop'],
  });

  menuItems.forEach((item) => {
    const li = createElement({
      tagName: 'li',
      parent: ul,
    });

    const a = createElement({
      tagName: 'a',
      classNames: item.classNames,
      attributes: [{ href: item.href }],
      parent: li,
    });

    const svg = createSvg({
      tagName: 'svg',
      attributes: {
        width: '24',
        height: '24',
        viewBox: '0 0 24 24',
        'aria-hidden': 'true',
      },
      parent: a,
    });

    createSvg({
      tagName: 'use',
      attributes: { xlinkHref: item.svgHref },
      parent: svg,
    });

    if (item.extraSvgHref) {
      const extraSvg = createSvg({
        tagName: 'svg',
        attributes: {
          width: '24',
          height: '24',
          viewBox: '0 0 24 24',
          'aria-hidden': 'true',
          class: 'logout-svg visually-hidden',
        },
        parent: a,
      });

      createSvg({
        tagName: 'use',
        attributes: { xlinkHref: item.extraSvgHref },
        parent: extraSvg,
      });
    }

    const div = createElement({
      tagName: 'div',
      classNames: item.text === 'Log in' ? ['tooltip', 'tooltip--login'] : ['tooltip'],
      parent: a,
    });

    createElement({
      tagName: 'p',
      text: item.text,
      parent: div,
    });
  });

  return ul;
};

export default createMenuUser;
