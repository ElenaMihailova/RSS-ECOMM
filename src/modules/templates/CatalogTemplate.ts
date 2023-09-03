import IntroCatalog from './IntroCatalog';
import breadcrumbLinksCatalog from '../../assets/data/breadcrumbs';
import generateBreadcrumbs from '../components/breadcrumbs/generateBreadcrumbs';
import catalogWrapper from './CatalogWrapper';
import { createElement } from '../helpers/functions';
import Router from '../router/router';

const breadcrumbsCatalog = generateBreadcrumbs(breadcrumbLinksCatalog);

const contentContainer = createElement({
  tagName: 'div',
  classNames: ['contentContainer'],
});

contentContainer.appendChild(IntroCatalog);
contentContainer.appendChild(breadcrumbsCatalog);
contentContainer.appendChild(catalogWrapper());

const catalogContent = {
  title: 'Catalog',
  content: contentContainer,
};

export default catalogContent;
