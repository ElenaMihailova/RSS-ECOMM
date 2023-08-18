import PageView from '../../core/pageView';
import errorMarkup from '../../templates/ErrorTemplate';

class ErrorView extends PageView {
  constructor() {
    super();
    this.container.textContent = errorMarkup;
  }

  public render(): HTMLElement {
    return this.container;
  }
}

export default ErrorView;
