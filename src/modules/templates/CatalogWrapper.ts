import generateCatalogList from '../components/catalogList/generateCatalogList';
import { createElement } from '../helpers/functions';

const myProductData = [
  { image: 'path/to/image1.jpg', title: 'Продукт 1', price: 1000, link: '#' },
  { image: 'path/to/image2.jpg', title: 'Продукт 2', price: 2000, link: '#' },
  { image: 'path/to/image3.jpg', title: 'Продукт 3', price: 3000, link: '#' },
];

const catalogList = generateCatalogList(myProductData);

const catalogWrapper = (): HTMLElement => {
  const container = createElement({
    tagName: 'section',
    classNames: ['catalog__wrap', 'container'],
  });

  const filter = createElement({
    tagName: 'div',
    classNames: ['catalog__filter', 'filter'],
    parent: container,
  });

  const sorting = createElement({
    tagName: 'div',
    classNames: ['catalog__sort', 'sorting'],
    parent: container,
  });

  const items = createElement({
    tagName: 'div',
    classNames: ['catalog__items'],
    parent: container,
  });

  items.appendChild(catalogList);

  return container;
};

export default catalogWrapper;
