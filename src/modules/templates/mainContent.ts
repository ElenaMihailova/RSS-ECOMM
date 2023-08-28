import createCatalogSection from '../components/createCatalogSection';
import introSection from './IntroSectionModule';
import blogSection from './BlogSectionModule';
import featuresSection from './FeaturesSectionModule';
import orderSection from './OrderSectionModule';
import { catalogItemsMain } from '../../assets/data/catalogItems';

const catalogSection = createCatalogSection(catalogItemsMain);

const mainContent = {
  title: 'Tea Shop',
  content: `${introSection}${featuresSection}${catalogSection}${blogSection}${orderSection}`,
};

export default mainContent;
