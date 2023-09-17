import IntroCatalog from './IntroCatalog';
import catalogWrapper from './CatalogWrapper';
import { createElement } from '../helpers/functions';
import { CatalogContent } from '../../types/types';

async function createCatalogContent(): Promise<CatalogContent> {
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

  return catalogContent;
}

export default createCatalogContent;
