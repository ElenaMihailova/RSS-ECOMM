import { createElement } from '../../helpers/functions';

const basketContainer = createElement({
  tagName: 'div',
  classNames: ['basketContainer'],
});

const basketContent = {
  title: 'Basket',
  content: basketContainer,
};

export default basketContent;
