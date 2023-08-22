import { PageUrls } from '../../assets/data/constants';
import { RouteAction } from '../../types/types';
import Router from '../router/router';
import Main from '../core/main';
import IndexView from '../pages/index/indexPageView';
import RegistrationView from '../pages/registration/registrationPageView';
import LoginView from '../pages/login/loginPageView';
import ErrorView from '../pages/error/errorPageView';
import LoginController from '../pages/login/loginPageController';
import { getElement, getFromLS, removeFromLS } from '../helpers/functions';
import { FooterLinksType, NavLink } from '../../types/nav.types';
import createLayout from '../components/createLayout';
import { headerLinks, footerLinks } from '../../assets/data/navigationData';
import mainContent from '../templates/mainContent';
import setupHeaderListeners from '../components/setupHeaderListeners';
import RegistrationController from '../pages/registration/registrationPageController';

class App {
  private static container: HTMLElement = document.body;

  public router: Router;

  public main: Main | null;

  private loginController: LoginController | null;

  private headerData: NavLink[] = headerLinks;

  private footerData: FooterLinksType = footerLinks;

  private registrationController: RegistrationController | null;

  constructor() {
    this.main = null;
    this.loginController = null;
    const routes = this.createRoutes();
    this.router = new Router(routes);
    this.createView();
    this.registrationController = null;
    this.loginBtnHandler();
    this.registrationBtnHandler();
  }

  private createView(): void {
    const layout = createLayout(this.headerData, this.footerData);
    App.container.append(layout.header, layout.footer);

    const loginSvg = getElement('.login-svg');
    const logoutSvg = getElement('.logout-svg');
    const tooltip = getElement('.tooltip--login');

    if (getFromLS('token')) {
      loginSvg.classList.add('visually-hidden');
      logoutSvg.classList.remove('visually-hidden');
      tooltip.textContent = 'LOG OUT';
    } else {
      logoutSvg.classList.add('visually-hidden');
      loginSvg.classList.remove('visually-hidden');
      tooltip.textContent = 'LOG IN';
    }

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
            if (getFromLS('token')) {
              this.router.navigateFromButton('index');
              return;
            }
            const registrationView = new RegistrationView();
            this.main.setViewContent(registrationView);
            this.registrationController = new RegistrationController(this.router, registrationView);
          }
        },
      },
      {
        path: `${PageUrls.LoginPageUrl}`,
        callback: (): void => {
          if (this.main) {
            this.main.clearContent();

            if (getFromLS('token')) {
              this.router.navigateFromButton(PageUrls.IndexPageUrl);
              return;
            }

            this.main.setViewContent(new LoginView());
            this.loginController = new LoginController(this.router);
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

  private loginBtnHandler(): void {
    const loginBtn = getElement('.login--desktop');
    const loginSvg = getElement('.login-svg');
    const logoutSvg = getElement('.logout-svg');
    const tooltip = getElement('.tooltip--login');

    loginBtn.addEventListener('click', (e: Event): void => {
      e.preventDefault();
      if (getFromLS('token')) {
        logoutSvg.classList.add('visually-hidden');
        loginSvg.classList.remove('visually-hidden');
        tooltip.textContent = 'LOG IN';
        removeFromLS('token');
      } else {
        this.router.navigateFromButton(PageUrls.LoginPageUrl);
      }
    });
  }

  private registrationBtnHandler(): void {
    if (getFromLS('token')) {
      this.router.navigateFromButton(PageUrls.IndexPageUrl);
    } else {
      this.router.navigateFromButton(PageUrls.RegistrationPageUrl);
    }
  }
}

export default App;
