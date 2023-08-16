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
    window.history.pushState({}, '', `${window.location.origin}/${url}`);

    const urlString = window.location.pathname.slice(1);

    const res = { path: '', resource: '' };

    const path = urlString.split('/');
    [res.path = '', res.resource = ''] = path;

    this.urlHandler(res);
  }

  public redirectToErrorPage(): void {
    const routeNotFound: RouteAction | undefined = this.routes.find((item) => item.path === PageUrls.ErrorPageUrl);

    if (routeNotFound) {
      this.navigateTo(routeNotFound.path);
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
