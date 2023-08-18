import ComponentView from '../../helpers/component-view';

class IndexView extends ComponentView {
  constructor() {
    super();
    this.container.textContent = 'INDEX PAGE';
  }

  public render(): HTMLElement {
    return this.container;
  }
}

export default IndexView;
