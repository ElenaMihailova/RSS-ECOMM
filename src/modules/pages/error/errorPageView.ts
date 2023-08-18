import PageView from '../../core/pageView';
import errorMarkup from '../../templates/ErrorTemplate';

class ErrorView extends PageView {
  constructor() {
    super();
    this.container.innerHTML = errorMarkup;
  }

  public render(): HTMLElement {
    return this.container;
  }
}

export default ErrorView;
