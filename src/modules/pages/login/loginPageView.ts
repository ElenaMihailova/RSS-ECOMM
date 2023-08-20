import PageView from '../../core/pageView';

class LoginView extends PageView {
  constructor() {
    super();
    this.container.textContent = 'LOGIN PAGE';
  }

  public render(): HTMLElement {
    return this.container;
  }
}

export default LoginView;
