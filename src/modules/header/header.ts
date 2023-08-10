import router from '../router/router';

const ButtonsNames: { [key: string]: string } = {
  Main: 'main',
  Login: 'login',
  Registration: 'registration',
};

class Header {
  protected container: HTMLElement;

  constructor() {
    this.container = document.createElement('div');
  }

  private renderHeaderButtons(container: HTMLElement): void {
    Object.entries(ButtonsNames).forEach((btn) => {
      const pageBtn = document.createElement('button');
      const [name, url] = btn;
      pageBtn.textContent = name;
      pageBtn.onclick = (): void => {
        router.navigateTo(url);
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
