import { createElement, createSvg } from '../helpers/functions';
import menuItems from '../../assets/data/menuItems';

const menuUser = (): HTMLElement => {
  const ulUser = createElement({
    tagName: 'ul',
    classNames: ['menu__user', 'menu__user--mobile'],
  });

  menuItems.forEach((item) => {
    const liUser = createElement({
      tagName: 'li',
      parent: ulUser,
    });

    const a = createElement({
      tagName: 'a',
      classNames: item.classNames,
      href: item.href,
      parent: liUser,
    });

    if (item.contents) {
      item.contents.forEach((content) => {
        const div = createElement({
          tagName: 'div',
          classNames: content.divClass ? [content.divClass] : [],
          parent: a,
        });

        const svg = createSvg({
          tagName: 'svg',
          attributes: {
            width: '24',
            height: '24',
            viewBox: '0 0 24 24',
            'aria-hidden': 'true',
          },
          parent: div,
        });

        createSvg({
          tagName: 'use',
          attributes: {
            xlinkHref: content.svgHref,
          },
          parent: svg,
        });

        const pElement = createElement({
          tagName: 'p',
          html: content.text,
          parent: div,
        });
      });
    } else {
      const div = createElement({
        tagName: 'div',
        parent: a,
      });

      const svg = createSvg({
        tagName: 'svg',
        attributes: {
          width: '24',
          height: '24',
          viewBox: '0 0 24 24',
          'aria-hidden': 'true',
        },
        parent: div,
      });

      createSvg({
        tagName: 'use',
        attributes: {
          xlinkHref: item.svgHref,
        },
        parent: svg,
      });

      const pElement = createElement({
        tagName: 'p',
        html: item.text,
        parent: div,
      });
    }
  });

  return ulUser;
};

export default menuUser;
