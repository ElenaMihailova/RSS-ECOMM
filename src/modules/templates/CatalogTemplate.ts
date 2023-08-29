import IntroCatalog from './IntroCatalog';
import breadcrumbLinksCatalog from '../../assets/data/breadcrumbs';
import generateBreadcrumbs from '../components/breadcrumbs/generateBreadcrumbs';
import catalogWrapper from './CatalogWrapper';

const breadcrumbsCatalog = generateBreadcrumbs(breadcrumbLinksCatalog);

const catalogContent = {
  title: 'Catalog',
  content: `${IntroCatalog}${breadcrumbsCatalog}${catalogWrapper}`,
};

export default catalogContent;
