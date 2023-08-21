import PageView from '../core/pageView';

class Main {
  protected container: HTMLElement;

  constructor() {
    this.container = document.createElement('div');
    this.container.classList.add('main');
  }

  public render(): HTMLElement {
    return this.container;
  }

  public setContent(content: PageView): void {
    this.container.innerHTML = '';
    this.container.append(content.render());
  }
}

export default Main;
