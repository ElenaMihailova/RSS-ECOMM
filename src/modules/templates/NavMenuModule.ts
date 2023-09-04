import { createElement } from '../helpers/functions';
import { headerLinks } from '../../assets/data/navigationData';
import Router from '../router/router';

const navMenu = ({ router }: { router: Router }): HTMLElement => {
  const ulNav = createElement({
    tagName: 'ul',
    classNames: ['menu__nav'],
  });

  const baseClasses = ['titleMonserrat', 'titleMonserrat--small'];

  headerLinks.forEach((item) => {
    const li = createElement({
      tagName: 'li',
      parent: ulNav,
    });

    const classNames = [...baseClasses];
    // if (item.inactive) {
    //   classNames.push('no-active');
    // }

    createElement({
      tagName: 'a',
      classNames,
      text: item.text,
      parent: li,
      href: item.href,
      router,
    });
  });

  return ulNav;
};

export default navMenu;
