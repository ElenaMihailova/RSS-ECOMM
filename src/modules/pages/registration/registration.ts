import Page from '../../../templates/page';

class RegistrationPage extends Page {
  constructor() {
    super();
    this.container.textContent = 'REGISTRATION PAGE';
  }

  public render(): HTMLElement {
    return this.container;
  }
}

export default RegistrationPage;
