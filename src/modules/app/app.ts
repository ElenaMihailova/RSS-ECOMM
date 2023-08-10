import Page from '../../templates/page';
import Header from '../header/header';
import ErrorPage from '../pages/error/error';
import Login from '../pages/login/login';
import Main from '../pages/main/main';
import Registration from '../pages/registration/registration';
import router from '../router/router';

const enum PageIds {
  MainPageId = 'main',
  LoginPageId = 'login',
  RegistrationPageId = 'registration',
}

class App {
  private static container: HTMLElement = document.body;

  private header: Header;

  private static defaultPageId = 'current-page';

  private static renderNewPage(id: string): void {
    const currentPage = document.querySelector(`#${this.defaultPageId}`);

    if (currentPage) {
      currentPage.remove();
    }
    let page: Page | null = null;

    if (id === PageIds.MainPageId) {
      page = new Main();
    } else if (id === PageIds.LoginPageId) {
      page = new Login();
    } else if (id === PageIds.RegistrationPageId) {
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

  private static route(): void {
    router.add('main', () => {
      App.renderNewPage(PageIds.MainPageId);
    });

    router.add('login', () => {
      App.renderNewPage(PageIds.LoginPageId);
    });

    router.add('registration', () => {
      App.renderNewPage(PageIds.RegistrationPageId);
    });

    router.addUriListener();
  }

  private enableRouteChange(): void {
    window.addEventListener('popstate', () => {
      const path = window.location.pathname.slice(1);
      App.renderNewPage(path);
    });
  }

  constructor() {
    this.header = new Header();
  }

  public run(): void {
    App.container.append(this.header.render());
    App.renderNewPage(PageIds.MainPageId);
    App.route();
    this.enableRouteChange();
  }
}

export default App;
