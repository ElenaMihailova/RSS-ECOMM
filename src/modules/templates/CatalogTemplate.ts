import IntroCatalog from './IntroCatalog';
import catalogWrapper from './CatalogWrapper';
import { createElement } from '../helpers/functions';

const contentContainer = createElement({
  tagName: 'div',
  classNames: ['contentContainer'],
});

contentContainer.appendChild(IntroCatalog);
const catalogWrapperElement = await catalogWrapper();
contentContainer.appendChild(catalogWrapperElement);

const catalogContent = {
  title: 'Catalog',
  content: contentContainer,
};

export default catalogContent;
