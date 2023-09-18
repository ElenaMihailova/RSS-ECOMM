import { ProductProjection } from '@commercetools/platform-sdk';
import { addCartItem } from '../../../api';
import ApiClientBuilder from '../../../api/buildRoot';
import { getFromLS } from '../../../helpers/functions';

const addProductToCart = async (product: ProductProjection, quantity: number): Promise<void> => {
  const cartVersion = Number(getFromLS('cartVersion')) || 1;
  const cartID = getFromLS('cartID') as string;

  await addCartItem(ApiClientBuilder.currentRoot, cartID, cartVersion, product.id, quantity);
};

export default addProductToCart;
