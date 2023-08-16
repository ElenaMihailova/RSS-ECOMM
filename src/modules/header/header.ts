import { ButtonsNamesAndUrls } from '../../constants';
import Router from '../router/router';

class Header {
  protected container: HTMLElement;

  private router: Router;

  constructor(router: Router) {
    this.container = document.createElement('div');
    this.container.classList.add('header');
    this.router = router;
  }

  private renderHeaderButtons(container: HTMLElement): void {
    Object.entries(ButtonsNamesAndUrls).forEach((btn) => {
      const pageBtn = document.createElement('button');
      const [name, url] = btn;
      pageBtn.textContent = name;
      pageBtn.onclick = (): void => {
        this.router.navigateTo(url);
      };
      container.append(pageBtn);
    });
  }

  public render(): HTMLElement {
    this.renderHeaderButtons(this.container);
    return this.container;
  }
}

export default Header;
