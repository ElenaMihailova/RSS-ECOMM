import IntroCatalog from './IntroCatalog';
import catalogWrapper from './CatalogWrapper';
import { createElement } from '../helpers/functions';
import Router from '../router/router';

const contentContainer = createElement({
  tagName: 'div',
  classNames: ['contentContainer'],
});

contentContainer.appendChild(IntroCatalog);
contentContainer.appendChild(catalogWrapper);

const catalogContent = {
  title: 'Catalog',
  content: contentContainer,
};

export default catalogContent;
