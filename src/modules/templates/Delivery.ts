import { createElement } from '../helpers/functions';
import deliveryTerms from '../../assets/data/deliveryTerms';

const delivery = (): HTMLElement => {
  const container = createElement({
    tagName: 'section',
    classNames: ['delivery', 'container'],
  });

  const title = createElement({
    tagName: 'h2',
    classNames: ['delivery__title', 'titleMonserrat--medium'],
    parent: container,
    html: 'Delivery and retour',
  });

  const list = createElement({
    tagName: 'ul',
    classNames: ['delivery__list'],
    parent: container,
  });

  deliveryTerms.forEach((content) => {
    createElement({
      tagName: 'li',
      classNames: ['delivery__item'],
      parent: list,
      html: content,
    });
  });
  return container;
};

export default delivery;
