import Page from '../../../templates/page';

class MainPage extends Page {
  constructor() {
    super();
    this.container.textContent = 'MAIN PAGE';
  }

  public render(): HTMLElement {
    return this.container;
  }
}

export default MainPage;
