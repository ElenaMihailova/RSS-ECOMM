class Main {
  protected container: HTMLElement;

  constructor() {
    this.container = document.createElement('main');
    this.container.classList.add('main');
  }

  private insertMainInDOM(): void {
    const footer = document.querySelector('footer');
    if (footer) {
      footer.insertAdjacentElement('beforebegin', this.container);
    } else {
      document.body.appendChild(this.container);
    }
  }

  public clearContent(): void {
    this.container.innerHTML = '';
  }

  public render(): HTMLElement {
    this.insertMainInDOM();
    return this.container;
  }

  public setContent(content: HTMLElement): void {
    this.container.appendChild(content);
    this.insertMainInDOM();
  }
}

export default Main;
