import { createElement } from '../../helpers/functions';

const basketItems = (): HTMLElement => {
  const container = createElement({
    tagName: 'div',
    classNames: ['items__wrap', 'buying'],
  });

  const ul = createElement({
    tagName: 'ul',
    classNames: ['buying__list'],
    parent: container,
  });

  const itemsData = [
    { name: 'Ceylon Ginger Cinnamon chai tea', sum: '€3.90', src: '../image/herbal-tea.svg' },
    { name: 'Tea 2', sum: '€3.50', src: '../image/item.png' },
    { name: 'Tea 2', sum: '€3.50', src: '../image/white.png' },
  ];

  itemsData.forEach((itemData) => {
    const li = createElement({
      tagName: 'li',
      classNames: ['buying__item'],
      parent: ul,
    });

    const image = createElement({
      tagName: 'img',
      classNames: ['buying__image'],
      attributes: [{ alt: '' }, { src: `${itemData.src}` }],
      parent: li,
    });

    const title = createElement({
      tagName: 'h3',
      classNames: ['buying__title'],
      parent: li,
    });

    const name = createElement({
      tagName: 'span',
      classNames: ['buying__name'],
      parent: title,
      text: itemData.name,
    });

    const weight = createElement({
      tagName: 'span',
      classNames: ['buying__weight'],
      parent: title,
      text: '- 50 g',
    });

    const button = createElement({
      tagName: 'button',
      classNames: ['buying__button', 'button', 'button--text'],
      text: 'Remove',
      parent: li,
    });

    const quantity = createElement({
      tagName: 'div',
      classNames: ['buying__quantity'],
      parent: li,
    });

    const minus = createElement({
      tagName: 'input',
      classNames: ['minus'],
      attributes: [{ type: 'button' }, { value: '-' }],
      parent: quantity,
    });

    const number = createElement({
      tagName: 'input',
      classNames: ['quantity'],
      attributes: [{ type: 'text' }, { value: '0' }],
      parent: quantity,
    });

    const plus = createElement({
      tagName: 'input',
      classNames: ['plus'],
      attributes: [{ type: 'button' }, { value: '+' }],
      parent: quantity,
    });

    const sum = createElement({
      tagName: 'p',
      classNames: ['buying__sum'],
      text: itemData.sum,
      parent: li,
    });
  });

  return container;
};

export default basketItems;
