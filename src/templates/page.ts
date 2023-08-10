abstract class Page {
  protected container: HTMLElement;

  constructor() {
    this.container = document.createElement('div');
  }

  public render(): HTMLElement {
    return this.container;
  }
}

export default Page;
