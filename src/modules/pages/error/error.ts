import Page from '../../../templates/page';

class ErrorPage extends Page {
  constructor() {
    super();
    this.container.textContent = `'404': 'Error! The page was not found.'`;
  }

  public render(): HTMLElement {
    return this.container;
  }
}

export default ErrorPage;
