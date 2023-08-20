import { PageUrls } from '../../assets/data/constants';
import { RouteAction } from '../../types/types';
import Router from '../router/router';
import Main from '../core/main';
import IndexView from '../pages/index/indexPageView';
import RegistrationView from '../pages/registration/registrationView';
import LoginView from '../pages/login/loginPageView';
import ErrorView from '../pages/error/errorPageView';
import { FooterLinksType, NavLink } from '../../types/nav.types';
import createLayout from '../components/createLayout';
import { headerLinks, footerLinks } from '../../assets/data/navigationData';
import mainContent from '../templates/mainContent';
import setupHeaderListeners from '../components/setupHeaderListeners';

class App {
  private static container: HTMLElement = document.body;

  public router: Router;

  public main: Main | null;

  private headerData: NavLink[] = headerLinks;

  private footerData: FooterLinksType = footerLinks;

  constructor() {
    this.main = null;
    const routes = this.createRoutes();
    this.router = new Router(routes);
    this.createView();
  }

  private createView(): void {
    const layout = createLayout(this.headerData, this.footerData);
    App.container.append(layout.header, layout.footer);

    setupHeaderListeners('hamburger', 'menu');

    if (!this.main) {
      this.main = new Main();
    }
    App.container.append(this.main.render());
  }

  private createRoutes(): RouteAction[] {
    return [
      {
        path: ``,
        callback: (): void => {
          if (this.main) {
            this.main.clearContent();
            this.main.setContent(new IndexView(mainContent).render());
          }
        },
      },
      {
        path: `${PageUrls.IndexPageUrl}`,
        callback: (): void => {
          if (this.main) {
            this.main.clearContent();
            this.main.setContent(new IndexView(mainContent).render());
          }
        },
      },
      {
        path: `${PageUrls.RegistrationPageUrl}`,
        callback: (): void => {
          if (this.main) {
            this.main.clearContent();
            this.main.setContent(new RegistrationView().render());
          }
        },
      },
      {
        path: `${PageUrls.LoginPageUrl}`,
        callback: (): void => {
          if (this.main) {
            this.main.clearContent();
            this.main.setContent(new LoginView().render());
          }
        },
      },
      {
        path: `${PageUrls.ErrorPageUrl}`,
        callback: (): void => {
          if (this.main) {
            this.main.clearContent();
            this.main.setContent(new ErrorView().render());
          }
        },
      },
    ];
  }
}

export default App;
