import { getProducts } from '../../api/apiClient';
import Router from '../../router/router';

class CatalogController {
  private router: Router;

  constructor(router: Router) {
    this.router = router;
    this.viewProducts();
  }

  private viewProducts(): void {
    getProducts();
  }
}

export default CatalogController;
