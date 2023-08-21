import { PageUrls } from '../../assets/data/constants';
import { RouteAction, UserRequest } from '../../types/types';

class Router {
  public routes: RouteAction[];

  constructor(routes: RouteAction[]) {
    this.routes = routes;

    window.addEventListener('DOMContentLoaded', (): void => {
      const path = window.location.pathname.slice(1);
      this.navigateFromBrowser(path);
    });

    window.addEventListener('popstate', (): void => {
      const path = window.location.pathname.slice(1);
      this.navigateFromBrowser(path);
    });
  }

  public navigateFromButton(url: string): void {
    window.history.pushState({}, '', `/${url}`);

    this.navigate(url);
  }

  private navigateFromBrowser(url: string): void {
    this.navigate(url);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private navigate(url: string): void {
    const urlString = window.location.pathname.slice(1);

    const res = { path: '', resource: '' };

    const path = urlString.split('/');
    [res.path = '', res.resource = ''] = path;

    this.urlHandler(res);
  }

  private redirectToErrorPage(): void {
    const routeNotFound: RouteAction | undefined = this.routes.find((item) => item.path === PageUrls.ErrorPageUrl);

    if (routeNotFound) {
      routeNotFound.callback();
    }
  }

  private urlHandler(request: UserRequest): void {
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
