import IntroCatalog from './IntroCatalog';
import breadcrumbLinksCatalog from '../../assets/data/breadcrumbs';
import generateBreadcrumbs from '../components/breadcrumbs/generateBreadcrumbs';
import generateCatalogList from '../components/catalogList/generateCatalogList';

const myProductData = [
  { image: 'path/to/image1.jpg', title: 'Продукт 1', price: 1000, link: '#' },
  { image: 'path/to/image2.jpg', title: 'Продукт 2', price: 2000, link: '#' },
  { image: 'path/to/image3.jpg', title: 'Продукт 3', price: 3000, link: '#' },
];

const breadcrumbsCatalog = generateBreadcrumbs(breadcrumbLinksCatalog);
const catalogList = generateCatalogList(myProductData);

const catalogContent = {
  title: 'Catalog',
  content: `${IntroCatalog}${breadcrumbsCatalog}${catalogList}`,
};

export default catalogContent;
