import { createElement } from '../../helpers/functions';

const basketSum = (): HTMLElement => {
  const order = createElement({
    tagName: 'div',
    classNames: ['cart__sum', 'sum', 'container'],
  });

  createElement({
    tagName: 'h3',
    classNames: ['sum__title', 'titleMonserrat--medium'],
    html: 'Order summery',
    parent: order,
  });

  const wrap = createElement({
    tagName: 'div',
    classNames: ['sum__wrap', 'titleMonserrat--medium'],
    parent: order,
  });

  createElement({
    tagName: 'p',
    classNames: ['sum__subtotal'],
    html: 'Subtotal',
    parent: wrap,
  });

  createElement({
    tagName: 'p',
    classNames: ['sum__amount', 'subtotal__amount'],
    parent: wrap,
  });

  const wrap2 = createElement({
    tagName: 'div',
    classNames: ['sum__wrap', 'titleMonserrat--medium'],
    parent: order,
  });

  createElement({
    tagName: 'p',
    classNames: ['sum__subtotal'],
    html: 'Delivery',
    parent: wrap2,
  });

  createElement({
    tagName: 'p',
    classNames: ['sum__amount', 'delivery__amount'],
    parent: wrap2,
  });

  createElement({
    tagName: 'div',
    classNames: ['sum__line'],
    parent: order,
  });

  const wrap3 = createElement({
    tagName: 'div',
    classNames: ['sum__wrap', 'titleMonserrat--medium'],
    parent: order,
  });

  createElement({
    tagName: 'p',
    classNames: ['sum__total'],
    html: 'Total',
    parent: wrap3,
  });

  createElement({
    tagName: 'p',
    classNames: ['sum__amount', 'total__amount'],
    parent: wrap3,
  });

  createElement({
    tagName: 'p',
    classNames: ['sum__text'],
    html: 'Estimated shipping time: 2 days',
    parent: order,
  });

  createElement({
    tagName: 'button',
    classNames: ['sum__button', 'button', 'button--black'],
    text: 'Check out',
    parent: order,
  });

  return order;
};

export default basketSum;
