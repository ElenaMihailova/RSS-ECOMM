import { Cart } from '@commercetools/platform-sdk';
import { RefreshAuthMiddlewareOptions } from '@commercetools/sdk-client-v2';
import { PageUrls, ProductUrl } from '../../assets/data/constants';
import { RouteAction } from '../../types/types';
import Router from '../router/router';
import Main from '../core/main';
import IndexView from '../pages/index/indexPageView';
import RegistrationView from '../pages/registration/registrationPageView';
import LoginView from '../pages/login/loginPageView';
import ErrorView from '../pages/error/errorPageView';
import LoginController from '../pages/login/loginPageController';
import {
  getElement,
  getElementCollection,
  getFromLS,
  removeFromLS,
  setMenuBtnsView,
  setToLS,
  updateCartCommonQuantity,
} from '../helpers/functions';
import { FooterLinks, NavLink } from '../components/layout/nav.types';
import createLayout from '../components/layout/createLayout';
import { headerLinks, footerLinks } from '../../assets/data/navigationData';
import mainContent from '../templates/mainContent';
import setupHeaderListeners from '../components/setupHeaderListeners';
import RegistrationController from '../pages/registration/registrationPageController';
import ProfileController from '../pages/profile/profilePageController';
import ProfileView from '../pages/profile/profilePageView';
import CatalogView from '../pages/catalog/catalogPageView';
import CatalogController from '../pages/catalog/catalogPageController';
import ProductView from '../pages/catalog/product/productPageView';
import createCatalogContent from '../templates/CatalogTemplate';
import BasketView from '../pages/basket/basketPageView';
import AboutUsView from '../pages/about/aboutUsPageView';
import ApiClientBuilder from '../api/buildRoot';
import { getActiveCart } from '../api';
import MyTokenCache from '../api/myTokenCache';
import getBasketContent from '../pages/basket/basketContent';

class App {
  private static container: HTMLElement = document.body;

  public static routerInstance: Router | null = null;

  public router: Router;

  public main: Main | null;

  private loginController: LoginController | null;

  private headerData: NavLink[] = headerLinks;

  private footerData: FooterLinks = footerLinks;

  private registrationController: RegistrationController | null;

  private profileController: ProfileController | null;

  private catalogController: CatalogController | null;

  private profilePage: ProfileView | null;

  constructor() {
    this.main = null;
    this.profilePage = null;
    const routes = this.createRoutes();
    this.router = new Router(routes);
    this.createView();
    this.loginController = null;
    this.registrationController = null;
    this.catalogController = null;
    this.profileController = null;
    this.indexBtnHandler();
    this.navCatalogLinksHandler();
    this.navAboutUsLinksHandler();
    this.cartBtnsHandlers();
    this.loginBtnsHandlers();
    this.registrationBtnsHandlers();
    this.profileBtnsHandlers();
    this.router.navigate();
  }

  private createView(): void {
    const layout = createLayout(this.headerData, this.footerData, this.router);

    App.container.append(layout.header, layout.footer);

    if (getFromLS('cartID')) {
      const tokenCache = new MyTokenCache();

      const options: RefreshAuthMiddlewareOptions = {
        host: process.env.CTP_AUTH_URL as string,
        projectKey: process.env.CTP_PROJECT_KEY as string,
        credentials: {
          clientId: process.env.CTP_CLIENT_ID as string,
          clientSecret: process.env.CTP_CLIENT_SECRET as string,
        },
        refreshToken: getFromLS('refreshToken') as string,
        tokenCache,
        fetch,
      };

      ApiClientBuilder.currentRoot = ApiClientBuilder.createApiRootWithRefreshFlow(options);

      const response = getActiveCart(ApiClientBuilder.currentRoot);

      response.then((cart: Cart | Error) => {
        if (cart instanceof Error) {
          return;
        }

        updateCartCommonQuantity(cart);
      });

      const tokenInfo = tokenCache.get();

      if (tokenInfo.token) {
        setToLS('token', tokenInfo.token);
      }
    }

    setMenuBtnsView();

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
        callback: async (): Promise<void> => {
          if (this.main) {
            const catalogContent = await createCatalogContent();
            this.main.clearContent();
            this.main.setContent(new CatalogView(catalogContent).render());
            this.catalogController = new CatalogController(this.router);
          }
        },
      },
      {
        path: `${PageUrls.CatalogPageUrl}/${ProductUrl}`,
        callback: (link): void => {
          if (this.main && link) {
            this.main.clearContent();
            const productView = new ProductView(this.router, link);
            this.main.setViewContent(productView);
          }
        },
      },
      {
        path: `${PageUrls.AboutUsPageUrl}`,
        callback: (): void => {
          if (this.main) {
            this.main.clearContent();
            const aboutUsView = new AboutUsView();
            this.main.setViewContent(aboutUsView);
          }
        },
      },
      {
        path: `${PageUrls.RegistrationPageUrl}`,
        callback: (): void => {
          if (this.main) {
            this.main.clearContent();

            if (getFromLS('userID')) {
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

            if (getFromLS('userID')) {
              this.router.navigateFromButton(PageUrls.IndexPageUrl);
              return;
            }

            this.main.setViewContent(new LoginView());
            this.loginController = new LoginController(this.router);
          }
        },
      },
      {
        path: `${PageUrls.ProfilePageUrl}`,
        callback: this.redirectToProfile.bind(this),
      },
      {
        path: `${PageUrls.ProfilePageUrl}/${PageUrls.AddressesPageUrl}`,
        callback: this.redirectToProfile.bind(this),
      },
      {
        path: `${PageUrls.ProfilePageUrl}/${PageUrls.ChangePasswordPageUrl}`,
        callback: this.redirectToProfile.bind(this),
      },
      {
        path: `${PageUrls.BasketPageUrl}`,
        callback: async (): Promise<void> => {
          if (this.main) {
            this.main.clearContent();
            const content = await getBasketContent();
            this.main.setContent(new BasketView(content).render());
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

  private cartBtnsHandlers(): void {
    const cartBtn = getElement('.cart--desktop');
    const cartMobileBtn = getElement('.cart--mobile');

    cartBtn.addEventListener('click', this.btnMoveToBasketHandler.bind(this));
    cartMobileBtn.addEventListener('click', this.btnMoveToBasketHandler.bind(this));
  }

  private btnMoveToBasketHandler(e: Event): void {
    e.preventDefault();
    this.router.navigateFromButton(PageUrls.BasketPageUrl);
  }

  private loginBtnsHandlers(): void {
    const loginBtn = getElement('.login--desktop');
    const loginMobileBtn = getElement('.login--mobile');

    loginBtn.addEventListener('click', this.btnMoveToLoginHandler.bind(this));
    loginMobileBtn.addEventListener('click', this.btnMoveToLoginHandler.bind(this));
  }

  private btnMoveToLoginHandler(e: Event): void {
    e.preventDefault();
    if (getFromLS('userID')) {
      removeFromLS('token');
      removeFromLS('refreshToken');
      removeFromLS('cartID');
      removeFromLS('cartVersion');
      removeFromLS('userID');
      removeFromLS('version');
      setMenuBtnsView();
      this.logoutRedirect();
    } else {
      this.router.navigateFromButton(PageUrls.LoginPageUrl);
    }
  }

  private registrationBtnsHandlers(): void {
    const registrationBtn = getElement('.registration--desktop');
    const registrationMobileBtn = getElement('.registration--mobile');

    registrationBtn.addEventListener('click', this.btnMoveToRegistrationHandler.bind(this));
    registrationMobileBtn.addEventListener('click', this.btnMoveToRegistrationHandler.bind(this));
  }

  private btnMoveToRegistrationHandler(e: Event): void {
    e.preventDefault();
    const url = getFromLS('userID') ? PageUrls.IndexPageUrl : PageUrls.RegistrationPageUrl;
    this.router.navigateFromButton(url);
  }

  private profileBtnsHandlers(): void {
    const profileBtn = getElement('.profile--desktop');
    const profileMobileBtn = getElement('.profile--mobile');

    profileBtn.addEventListener('click', this.btnMoveToProfileHandler.bind(this));
    profileMobileBtn.addEventListener('click', this.btnMoveToProfileHandler.bind(this));
  }

  private btnMoveToProfileHandler(e: Event): void {
    e.preventDefault();
    const url = getFromLS('userID') ? PageUrls.ProfilePageUrl : PageUrls.IndexPageUrl;
    this.router.navigateFromButton(url);
  }

  private indexBtnHandler(): void {
    const indexBtn = getElement('.logo__link');
    indexBtn.addEventListener('click', this.btnMoveToIndexHandler.bind(this));
  }

  private homeBtnHandler(): void {
    const homeBtn = getElement('.home--button');
    homeBtn.addEventListener('click', this.btnMoveToIndexHandler.bind(this));
  }

  private navCatalogLinksHandler(): void {
    const navCatalogLinks = getElementCollection('.menu__nav--tc');
    navCatalogLinks.forEach((element) => {
      const catalogLink = element as HTMLAnchorElement;
      catalogLink.addEventListener('click', (e: Event) => {
        e.preventDefault();
        this.router.navigateFromButton(PageUrls.CatalogPageUrl);
      });
    });
  }

  private navAboutUsLinksHandler(): void {
    const navAboutUsLinks = getElementCollection('.menu__nav--about');
    navAboutUsLinks.forEach((element) => {
      const aboutUsLink = element as HTMLAnchorElement;
      aboutUsLink.addEventListener('click', (e: Event) => {
        e.preventDefault();
        this.router.navigateFromButton(PageUrls.AboutUsPageUrl);
      });
    });
  }

  private btnMoveToIndexHandler(e: Event): void {
    e.preventDefault();
    this.router.navigateFromButton(PageUrls.IndexPageUrl);
  }

  private redirectToProfile(): void {
    if (this.main) {
      this.main.clearContent();

      if (!getFromLS('passwordToken')) {
        this.router.navigateFromButton(PageUrls.LoginPageUrl);
        return;
      }
      this.profilePage = new ProfileView();
      this.main.setViewContent(this.profilePage);
      this.profileController = new ProfileController(this.router);
    }
  }

  private async logoutRedirect(): Promise<void> {
    switch (window.location.pathname.slice(1)) {
      case PageUrls.CatalogPageUrl:
      case PageUrls.ProfilePageUrl:
      case `${PageUrls.ProfilePageUrl}/${PageUrls.AddressesPageUrl}`:
      case `${PageUrls.ProfilePageUrl}/${PageUrls.ChangePasswordPageUrl}`:
        this.router.navigateFromButton(PageUrls.IndexPageUrl);
        break;
      default:
    }
  }
}

export default App;
