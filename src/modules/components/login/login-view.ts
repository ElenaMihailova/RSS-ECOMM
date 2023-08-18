import ComponentView from '../../../helpers/component-view';

class LoginView extends ComponentView {
  constructor() {
    super();
    this.container.textContent = 'LOGIN PAGE';
  }

  public render(): HTMLElement {
    return this.container;
  }
}

export default LoginView;
