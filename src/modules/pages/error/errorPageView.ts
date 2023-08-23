import { PageUrls } from '../../../assets/data/constants';
import PageView from '../../core/pageView';
import { getElement } from '../../helpers/functions';
import Router from '../../router/router';
import errorMarkup from '../../templates/ErrorTemplate';

class ErrorView extends PageView {
  private router: Router;

  constructor(router: Router) {
    super();
    this.router = router;
    this.container.innerHTML = errorMarkup;
  }

  public render(): HTMLElement {
    return this.container;
  }
}

export default ErrorView;
