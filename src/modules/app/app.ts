import { PageUrls } from '../../constants';
import Page from '../../templates/page';
import { RouteAction } from '../../types';
import Header from '../header/header';
import ErrorPage from '../pages/error/error';
import Login from '../pages/login/login';
import Main from '../pages/main/main';
import Registration from '../pages/registration/registration';
import Router from '../router/router';

class App {
  private static container: HTMLElement = document.body;

  private header: Header;

  private router: Router;

  private static defaultPageId = 'current-page';

  public static renderNewPage(id: string): void {
    const currentPage = document.querySelector(`#${this.defaultPageId}`);

    if (currentPage) {
      currentPage.remove();
    }
    let page: Page | null = null;

    if (id === PageUrls.MainPageUrl) {
      page = new Main();
    } else if (id === PageUrls.LoginPageUrl) {
      page = new Login();
    } else if (id === PageUrls.RegistrationPageUrl) {
      page = new Registration();
    } else {
      page = new ErrorPage();
    }

    if (page) {
      const pageHTML = page.render();
      pageHTML.id = App.defaultPageId;
      App.container.append(pageHTML);
    }
  }

  constructor() {
    const routes = this.createRoutes();
    this.router = new Router(routes);
    this.header = new Header(this.router);
    this.createView();
  }

  private createView(): void {
    App.container.append(this.header.render());
    App.renderNewPage(PageUrls.MainPageUrl);
  }

  public createRoutes(): RouteAction[] {
    return [
      {
        path: ``,
        callback: async (res: string): Promise<void> => {
          await App.renderNewPage(res);
        },
      },
      {
        path: `${PageUrls.MainPageUrl}`,
        callback: async (res: string): Promise<void> => {
          await App.renderNewPage(res);
        },
      },
      {
        path: `${PageUrls.RegistrationPageUrl}`,
        callback: async (res: string): Promise<void> => {
          await App.renderNewPage(res);
        },
      },
      {
        path: `${PageUrls.LoginPageUrl}`,
        callback: async (res: string): Promise<void> => {
          await App.renderNewPage(res);
        },
      },
      {
        path: `${PageUrls.ErrorPageUrl}`,
        callback: async (res: string): Promise<void> => {
          await App.renderNewPage(res);
        },
      },
    ];
  }
}

export default App;
