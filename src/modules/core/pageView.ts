import Router from '../router/router';

abstract class PageView {
  protected container: HTMLElement;

  protected id: string | undefined = '';

  constructor(id?: string | undefined, router?: Router) {
    this.id = id;
    this.container = document.createElement('div');
  }

  public render(): HTMLElement {
    return this.container;
  }

  public runHandlers(): void {}
}

export default PageView;
