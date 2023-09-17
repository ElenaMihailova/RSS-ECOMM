import { ProductProjection } from '@commercetools/platform-sdk';
import { CartProduct } from '../../../../types/interfaces';
import { addCartItem } from '../../../api';
import ApiClientBuilder from '../../../api/buildRoot';
import { getFromLS } from '../../../helpers/functions';

const addProductToCart = async (product: ProductProjection, quantity: number): Promise<void> => {
  if (!product.taxCategory || !product.masterVariant.prices) {
    return;
  }

  const productData: CartProduct = {
    name: product.name['en-US'],
    centAmount: product.masterVariant.prices[0].value.centAmount,
    slug: product.slug['en-US'],
    taxCategoryID: product.taxCategory?.id,
  };

  const cartVersion = Number(getFromLS('cartVersion')) || 1;
  const cartID = getFromLS('cartID') as string;

  await addCartItem(ApiClientBuilder.currentRoot, cartID, cartVersion, productData, quantity);
};

export default addProductToCart;
