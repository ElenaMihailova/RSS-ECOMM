import Page from '../../../templates/page';

class LoginPage extends Page {
  constructor() {
    super();
    this.container.textContent = 'LOGIN PAGE';
  }

  public render(): HTMLElement {
    return this.container;
  }
}

export default LoginPage;
