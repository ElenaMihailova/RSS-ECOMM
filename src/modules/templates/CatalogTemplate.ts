import IntroCatalog from './IntroCatalog';
import breadcrumbLinksCatalog from '../../assets/data/breadcrumbs';
import generateBreadcrumbs from '../components/breadcrumbs/generateBreadcrumbs';

const breadcrumbsCatalog = generateBreadcrumbs(breadcrumbLinksCatalog);

const catalogContent = {
  title: 'Catalog',
  content: `${IntroCatalog}${breadcrumbsCatalog}`,
};

export default catalogContent;
