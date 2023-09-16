import { createElement } from '../helpers/functions';
import { headerLinks } from '../../assets/data/navigationData';
import Router from '../router/router';

const navMenu = ({ router }: { router: Router }): HTMLElement => {
  const ulNav = createElement({
    tagName: 'ul',
    classNames: ['menu__nav'],
  });

  const navClasses = ['menu__nav--tc', 'menu__nav--acc', 'menu__nav--blog', 'menu__nav--about'];

  headerLinks.forEach((item, i) => {
    const li = createElement({
      tagName: 'li',
      parent: ulNav,
    });

    createElement({
      tagName: 'a',
      classNames: ['titleMonserrat', 'titleMonserrat--small', `${navClasses[i]}`],
      text: item.text,
      parent: li,
      href: item.href,
      router,
    });
  });

  return ulNav;
};

export default navMenu;
