import PageView from '../../core/pageView';

class RegistrationView extends PageView {
  constructor() {
    super();
    this.container.textContent = 'REGISTRATION PAGE';
  }

  public render(): HTMLElement {
    return this.container;
  }
}

export default RegistrationView;
