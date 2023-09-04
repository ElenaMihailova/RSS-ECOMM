import { PageUrls } from '../../assets/data/constants';
import { RouteAction, UserRequest } from '../../types/types';

class Router {
  private static instance: Router | null = null;

  public routes: RouteAction[];

  constructor(routes: RouteAction[]) {
    this.routes = routes;

    window.addEventListener('DOMContentLoaded', (): void => {
      this.navigate();
    });

    window.addEventListener('popstate', (): void => {
      this.navigate();
    });
  }

  public static getInstance(routes: RouteAction[]): Router {
    if (!Router.instance) {
      Router.instance = new Router(routes);
    }
    return Router.instance;
  }

  public navigateToLink(url: string): void {
    window.history.pushState({}, '', url);

    this.navigate();
  }

  public navigateFromButton(url: string): void {
    window.history.pushState({}, '', `/${url}`);

    this.navigate();
  }

  private navigate(): void {
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
