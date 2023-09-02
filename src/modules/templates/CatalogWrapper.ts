import generateCatalogList from '../components/catalogList/generateCatalogList';
import { createElement } from '../helpers/functions';

const catalogWrapper = createElement({
  tagName: 'section',
  classNames: ['catalog__wrap', 'container'],
});

const filter = createElement({
  tagName: 'div',
  classNames: ['catalog__filter', 'filter'],
});

catalogWrapper.appendChild(filter);

const wrapSort = (): HTMLElement => {
  const wrap = createElement({
    tagName: 'div',
    classNames: ['catalog__sortSearch'],
  });
  const sorting = createElement({
    tagName: 'div',
    classNames: ['catalog__sort', 'sorting'],
    parent: wrap,
  });

  const search = createElement({
    tagName: 'div',
    classNames: ['catalog__search', 'search'],
    parent: wrap,
  });

  return wrap;
};

catalogWrapper.appendChild(wrapSort());

const catalogList = await generateCatalogList();

catalogWrapper.appendChild(catalogList);

export default catalogWrapper;
