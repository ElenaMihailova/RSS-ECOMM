import ComponentView from '../../../helpers/component-view';

class ErrorView extends ComponentView {
  constructor() {
    super();
    this.container.textContent = `'404': 'Error! The page was not found.'`;
  }

  public render(): HTMLElement {
    return this.container;
  }
}

export default ErrorView;
