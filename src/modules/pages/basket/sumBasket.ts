import { createElement } from '../../helpers/functions';

const basketSum = (): HTMLElement => {
  const order = createElement({
    tagName: 'div',
    classNames: ['cart__sum', 'sum'],
  });

  const orderTitle = createElement({
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

  const subtotal = createElement({
    tagName: 'p',
    classNames: ['sum__subtotal'],
    html: 'Subtotal',
    parent: wrap,
  });

  const amount = createElement({
    tagName: 'p',
    classNames: ['sum__amount'],
    html: `€3.90`,
    parent: order,
  });

  const wrap2 = createElement({
    tagName: 'div',
    classNames: ['sum__wrap', 'titleMonserrat--medium'],
    parent: order,
  });

  const subtotal2 = createElement({
    tagName: 'p',
    classNames: ['sum__subtotal'],
    html: 'Delivery',
    parent: wrap2,
  });

  const amount2 = createElement({
    tagName: 'p',
    classNames: ['sum__amount'],
    html: `€3.95`,
    parent: wrap2,
  });

  const wrap3 = createElement({
    tagName: 'div',
    classNames: ['sum__wrap', 'titleMonserrat--medium'],
    parent: order,
  });

  const subtotal3 = createElement({
    tagName: 'p',
    classNames: ['sum__subtotal'],
    html: 'Total',
    parent: wrap3,
  });

  const amount3 = createElement({
    tagName: 'p',
    classNames: ['sum__amount'],
    html: `€7.85`,
    parent: wrap3,
  });

  const text = createElement({
    tagName: 'p',
    classNames: ['sum__text'],
    html: 'Estimated shipping time: 2 days',
    parent: order,
  });

  const button = createElement({
    tagName: 'button',
    classNames: ['sum__button', 'button', 'button--black'],
    text: 'Check out',
    parent: order,
  });

  return order;
};

export default basketSum;
