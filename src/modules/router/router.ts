import { PageUrls } from '../../constants';
import { RouteAction, UserRequest } from '../../types';

class Router {
  public routes: RouteAction[];

  constructor(routes: RouteAction[]) {
    this.routes = routes;

    window.addEventListener('DOMContentLoaded', (): void => {
      const path = window.location.pathname.slice(1);
      this.browserNavigateTo(path);
    });

    window.addEventListener('popstate', (): void => {
      const path = window.location.pathname.slice(1);
      this.browserNavigateTo(path);
    });
  }

  public navigateTo(url: string): void {
    window.history.pushState({}, '', `/${url}`);

    const urlString = window.location.pathname.slice(1);

    const res = { path: '', resource: '' };

    const path = urlString.split('/');
    [res.path = '', res.resource = ''] = path;

    this.urlHandler(res);
  }

  public browserNavigateTo(url: string): void {
    const urlString = window.location.pathname.slice(1);

    const res = { path: '', resource: '' };

    const path = urlString.split('/');
    [res.path = '', res.resource = ''] = path;

    this.urlHandler(res);
  }

  public redirectToErrorPage(): void {
    const routeNotFound: RouteAction | undefined = this.routes.find((item) => item.path === PageUrls.ErrorPageUrl);

    if (routeNotFound) {
      routeNotFound.callback();
    }
  }

  public urlHandler(request: UserRequest): void {
    const pathForFind = request.resource === '' ? request.path : `${request.path}/${request.resource}`;
    const route = this.routes.find((item) => item.path === pathForFind);

    if (!route) {
      this.redirectToErrorPage();
      return;
    }

    route.callback();
  }
}

export default Router;
