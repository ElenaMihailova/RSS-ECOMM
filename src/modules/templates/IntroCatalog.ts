import { createElement } from '../helpers/functions';

const IntroCatalog = createElement({
  tagName: 'section',
  classNames: ['catalogIntro'],
  html: `
    <div class="catalogIntro__image">
      <img src="./image/catalog.png" width="393" height="180">
    </div>
  `,
});

export default IntroCatalog;
