abstract class PageView {
  protected container: HTMLElement;

  constructor() {
    this.container = document.createElement('div');
  }

  public render(): HTMLElement {
    return this.container;
  }

  public runHandlers(): void {}
}

export default PageView;
