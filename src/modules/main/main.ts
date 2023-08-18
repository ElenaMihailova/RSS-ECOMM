import ComponentView from '../helpers/component-view';

class Main {
  protected container: HTMLElement;

  constructor() {
    this.container = document.createElement('div');
    this.container.classList.add('main');
  }

  public render(): HTMLElement {
    return this.container;
  }

  public setContent(content: ComponentView): void {
    this.container.innerHTML = '';
    this.container.append(content.render());
  }
}

export default Main;
