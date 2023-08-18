import ComponentView from '../../../helpers/component-view';

class RegistrationView extends ComponentView {
  constructor() {
    super();
    this.container.textContent = 'REGISTRATION PAGE';
  }

  public render(): HTMLElement {
    return this.container;
  }
}

export default RegistrationView;
