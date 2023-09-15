import { createElement } from '../helpers/functions';
import generateBreadcrumbs from '../components/breadcrumbs/generateBreadcrumbs';

const IntroCatalog = createElement({
  tagName: 'section',
  classNames: ['catalogIntro'],
  html: `
    <div class="catalogIntro__image">
      <img src="./image/catalog.png" width="393" height="180">
    </div>
  `,
});

const breadcrumbsCatalog = generateBreadcrumbs();

IntroCatalog.appendChild(breadcrumbsCatalog);

export default IntroCatalog;
