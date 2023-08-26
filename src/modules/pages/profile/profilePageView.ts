import PageView from '../../core/pageView';
import { createElement } from '../../helpers/functions';

class ProfileView extends PageView {
  constructor() {
    super();
    this.container.classList.add('profile-page');
  }

  public render(): HTMLElement {
    const profilePageContainer = createElement({
      tagName: 'div',
      classNames: ['profile-page__container'],
      parent: this.container,
    });

    return this.container;
  }
}

export default ProfileView;
