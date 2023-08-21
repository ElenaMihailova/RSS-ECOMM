import createCatalogSection from '../components/createCatalogSection';
import introSection from './IntroSectionModule';
import blogSection from './BlogSectionModule';
import featuresSection from './FeaturesSectionModule';
import orderSection from './OrderSectionModule';
import catalogItems from '../../assets/data/catalogItems';

const catalogSection = createCatalogSection(catalogItems);

const mainContent = {
  title: 'Tea Shop',
  content: `${introSection}${featuresSection}${catalogSection}${blogSection}${orderSection}`,
};

export default mainContent;
