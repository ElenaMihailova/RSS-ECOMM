import PageView from '../../core/pageView';

class IndexView extends PageView {
  constructor(element: { title: string; content: string }) {
    super();
    this.container.textContent = 'INDEX PAGE';
  }

  public render(): HTMLElement {
    return this.container;
  }
}

export default IndexView;
