import PageView from '../../core/pageView';

class ErrorView extends PageView {
  constructor() {
    super();
    this.container.textContent = `'404': 'Error! The page was not found.'`;
  }

  public render(): HTMLElement {
    return this.container;
  }
}

export default ErrorView;
