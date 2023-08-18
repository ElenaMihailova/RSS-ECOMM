import { PageUrls } from '../../constants';
import { RouteAction } from '../../types';
import Header from '../header/header';
import Router from '../router/router';
import Main from '../main/main';
import IndexView from '../pages/index/indexPageView';
import RegistrationView from '../pages/registration/registrationPageView';
import LoginView from '../pages/login/loginPageView';
import ErrorView from '../pages/error/errorPageView';

class App {
  private static container: HTMLElement = document.body;

  public router: Router;

  public header: Header | null;

  public main: Main | null;

  constructor() {
    this.header = null;
    this.main = null;
    const routes = this.createRoutes();
    this.router = new Router(routes);
    this.createView();
  }

  private createView(): void {
    this.header = new Header(this.router);
    this.main = new Main();
    App.container.append(this.header.render(), this.main.render());
  }

  private createRoutes(): RouteAction[] {
    return [
      {
        path: ``,
        callback: (): void => {
          if (this.main) {
            this.main.setContent(new IndexView());
          }
        },
      },
      {
        path: `${PageUrls.IndexPageUrl}`,
        callback: (): void => {
          if (this.main) {
            this.main.setContent(new IndexView());
          }
        },
      },
      {
        path: `${PageUrls.RegistrationPageUrl}`,
        callback: (): void => {
          if (this.main) {
            this.main.setContent(new RegistrationView());
          }
        },
      },
      {
        path: `${PageUrls.LoginPageUrl}`,
        callback: (): void => {
          if (this.main) {
            this.main.setContent(new LoginView());
          }
        },
      },
      {
        path: `${PageUrls.ErrorPageUrl}`,
        callback: (): void => {
          if (this.main) {
            this.main.setContent(new ErrorView());
          }
        },
      },
    ];
  }
}

export default App;
