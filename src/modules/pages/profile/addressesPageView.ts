import PageView from '../../core/pageView';
import './profilePage.scss';

class AddressesView extends PageView {
  constructor() {
    super();
    this.container.classList.add('addresses-page');
  }

  public render(): HTMLElement {
    return this.container;
  }

  public runHandlers(): void {}
}

export default AddressesView;
