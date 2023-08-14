import { PageUrls } from '../../constants';
import { RouteAction, UserRequest } from '../../types';

class Router {
  public routes: RouteAction[];

  constructor(routes: RouteAction[]) {
    this.routes = routes;

    document.addEventListener('DOMContentLoaded', () => {
      const path = window.location.pathname.slice(1);
      this.navigateTo(path);
    });

    window.addEventListener('popstate', () => {
      const path = window.location.pathname.slice(1);
      this.navigateTo(path);
    });
  }

  public navigateTo(url: string): void {
    if (typeof url === 'string') {
      this.setHistory(url);
    }

    console.log(url);
    const urlString = window.location.pathname.slice(1);

    const res = { path: '', resource: '' };

    const path = urlString.split('/');
    [res.path = '', res.resource = ''] = path;

    this.urlHandler(res);
  }

  private redirectToErrorPage(): void {
    const routeNotFound: RouteAction | undefined = this.routes.find((item) => item.path === PageUrls.ErrorPageUrl);

    if (routeNotFound) {
      this.navigateTo(routeNotFound.path);
    }
  }

  private setHistory(url: string): void {
    window.history.pushState({}, '', `/${url}`);
  }

  private urlHandler(request: UserRequest): void {
    const pathForFind = request.resource === '' ? request.path : `${request.path}/${request.resource}`;
    const route = this.routes.find((item) => item.path === pathForFind);

    if (!route) {
      this.redirectToErrorPage();
      return;
    }

    route.callback(pathForFind);
  }
}

export default Router;
