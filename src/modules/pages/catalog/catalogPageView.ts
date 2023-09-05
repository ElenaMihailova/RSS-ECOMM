import { MainData } from '../../../types/interfaces';
import PageView from '../../core/pageView';

class CatalogView extends PageView {
  private title: string;

  private content: string;

  constructor(catalogData: MainData) {
    super();
    this.title = catalogData.title;
    this.content = catalogData.content instanceof HTMLDivElement ? catalogData.content.outerHTML : catalogData.content;
  }

  private insertMainInDOM(): void {
    const footer = document.querySelector('footer');
    if (footer) {
      footer.insertAdjacentElement('beforebegin', this.container);
    } else {
      document.body.appendChild(this.container);
    }
  }

  public clearContent(): void {
    this.container.innerHTML = '';
  }

  public render(): HTMLElement {
    const contentContainer = document.createElement('div');
    contentContainer.innerHTML = `
      <h1 class="visually-hidden">${this.title}</h1>
      ${this.content}
    `;
    return contentContainer;
  }

  public setContent(content: PageView): void {
    const contentContainer = document.createElement('div');
    contentContainer.append(content.render());
    this.container.appendChild(contentContainer);
    this.insertMainInDOM();
  }
}

export default CatalogView;
