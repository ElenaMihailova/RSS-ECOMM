import { PageUrls, ProductUrls } from '../../assets/data/constants';
import { RouteAction, UserRequest } from '../../types/types';

class Router {
  public routes: RouteAction[];

  constructor(routes: RouteAction[]) {
    this.routes = routes;

    window.addEventListener('popstate', (): void => {
      this.navigate();
    });
  }

  public navigateToLink(url: string): void {
    window.history.pushState({}, '', url);

    this.navigate();
  }

  public navigateFromButton(url: string): void {
    window.history.pushState({}, '', `/${url}`);

    this.navigate();
  }

  public navigate(): void {
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
    if (request.resource && request.path === 'catalog' && ProductUrls.includes(request.resource)) {
      const route = this.routes[3];
      route.callback(request.resource);
      return;
    }

    const pathForFind = request.resource === '' ? request.path : `${request.path}/${request.resource}`;

    const route = this.routes.find((item) => item.path === pathForFind);

    console.log(route);

    if (!route) {
      this.redirectToErrorPage();
      return;
    }

    route.callback();
  }
}

export default Router;
