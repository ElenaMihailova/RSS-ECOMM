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
import CatalogView from '../pages/catalog/catalogPageView';
import catalogContent from '../templates/CatalogTemplate';

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
    this.registrationController = null;
    const routes = this.createRoutes();
    this.router = new Router(routes);
    this.createView();
    this.indexBtnHandler();
    this.loginBtnHandler();
    this.registrationBtnHandler();
    this.loginMobileBtnHandler();
  }

  private createView(): void {
    const layout = createLayout(this.headerData, this.footerData);
    App.container.append(layout.header, layout.footer);

    const loginSvg = getElement('.login-svg');
    const logoutSvg = getElement('.logout-svg');
    const tooltip = getElement('.tooltip--login');
    const registrationBtn = getElement('.registration--desktop');
    const registrationContainer = registrationBtn.closest('li');
    const registrationMobileBtn = getElement('.registration--mobile');
    const registrationMobileContainer = registrationMobileBtn.closest('a');

    if (getFromLS('token')) {
      loginSvg.classList.add('visually-hidden');
      logoutSvg.classList.remove('visually-hidden');
      registrationContainer?.classList.add('visually-hidden');
      registrationMobileContainer?.classList.add('visually-hidden');
      tooltip.textContent = 'LOG OUT';
    } else {
      logoutSvg.classList.add('visually-hidden');
      loginSvg.classList.remove('visually-hidden');
      registrationContainer?.classList.remove('visually-hidden');
      registrationMobileContainer?.classList.remove('visually-hidden');
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
        path: `${PageUrls.CatalogPageUrl}`,
        callback: (): void => {
          if (this.main) {
            this.main.clearContent();
            this.main.setContent(new CatalogView(catalogContent).render());
          }
        },
      },
      {
        path: `${PageUrls.RegistrationPageUrl}`,
        callback: (): void => {
          if (this.main) {
            this.main.clearContent();
            if (getFromLS('token')) {
              this.router.navigateFromButton(PageUrls.IndexPageUrl);
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
            this.main.setContent(new ErrorView(this.router).render());
          }
          this.homeBtnHandler();
        },
      },
    ];
  }

  private loginBtnHandler(): void {
    const loginBtn = getElement('.login--desktop');
    const loginSvg = getElement('.login-svg');
    const logoutSvg = getElement('.logout-svg');
    const tooltip = getElement('.tooltip--login');
    const registrationBtn = getElement('.registration--desktop');
    const registrationContainer = registrationBtn.closest('li');
    const registrationMobileBtn = getElement('.registration--mobile');
    const registrationMobileContainer = registrationMobileBtn.closest('a');

    loginBtn.addEventListener('click', (e: Event): void => {
      e.preventDefault();
      if (getFromLS('token')) {
        registrationContainer?.classList.remove('visually-hidden');
        registrationMobileContainer?.classList.remove('visually-hidden');
        logoutSvg.classList.add('visually-hidden');
        loginSvg.classList.remove('visually-hidden');
        tooltip.textContent = 'LOG IN';
        removeFromLS('token');
      } else {
        this.router.navigateFromButton(PageUrls.LoginPageUrl);
      }
    });
  }

  private loginMobileBtnHandler(): void {
    const loginMobileBtn = getElement('.login--mobile');
    const registrationBtn = getElement('.registration--desktop');
    const loginSvg = getElement('.login-svg');
    const logoutSvg = getElement('.logout-svg');
    const tooltip = getElement('.tooltip--login');
    const registrationContainer = registrationBtn.closest('li');
    const registrationMobileBtn = getElement('.registration--mobile');
    const registrationMobileContainer = registrationMobileBtn.closest('a');

    loginMobileBtn.addEventListener('click', (e: Event): void => {
      e.preventDefault();
      if (getFromLS('token')) {
        removeFromLS('token');
        registrationContainer?.classList.remove('visually-hidden');
        registrationMobileContainer?.classList.remove('visually-hidden');
        logoutSvg.classList.add('visually-hidden');
        loginSvg.classList.remove('visually-hidden');
        tooltip.textContent = 'LOG IN';
      } else {
        this.router.navigateFromButton(PageUrls.LoginPageUrl);
      }
    });
  }

  private registrationBtnHandler(): void {
    const registrationBtn = getElement('.registration--desktop');

    registrationBtn.addEventListener('click', (e: Event): void => {
      e.preventDefault();
      if (getFromLS('token')) {
        this.router.navigateFromButton(PageUrls.IndexPageUrl);
      } else {
        this.router.navigateFromButton(PageUrls.RegistrationPageUrl);
      }
    });
  }

  private indexBtnHandler(): void {
    const indexBtn = getElement('.logo__link');
    indexBtn.addEventListener('click', this.btnMoveToIndexHandler.bind(this));
  }

  private homeBtnHandler(): void {
    const homeBtn = getElement('.home--button');
    homeBtn.addEventListener('click', this.btnMoveToIndexHandler.bind(this));
  }

  private btnMoveToIndexHandler(e: Event): void {
    e.preventDefault();
    this.router.navigateFromButton(PageUrls.IndexPageUrl);
  }
}

export default App;
