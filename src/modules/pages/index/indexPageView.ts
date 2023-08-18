import PageView from '../../core/pageView';

interface MainData {
  title: string;
  content: string;
}

class IndexView extends PageView {
  protected container: HTMLElement;

  private title: string;

  private content: string;

  constructor(mainData: MainData) {
    super();
    this.title = mainData.title;
    this.content = mainData.content;

    this.container = document.createElement('main');
    this.container.classList.add('main');

    this.updateMainContent();
  }

  public updateMainContent(): void {
    this.container.innerHTML = `
      <h1 class="visually-hidden">${this.title}</h1>
      ${this.content}
    `;
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
    this.insertMainInDOM();
    return this.container;
  }

  public setContent(content: PageView): void {
    const contentContainer = document.createElement('div');
    contentContainer.append(content.render());
    this.container.appendChild(contentContainer);
    this.insertMainInDOM();
  }
}

export default IndexView;
