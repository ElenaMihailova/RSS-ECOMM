import { ProductProjection } from '@commercetools/platform-sdk';
import { addCartItem } from '../../../api';
import ApiClientBuilder from '../../../api/buildRoot';
import { disableQuantityButtons, getFromLS, updateCartCommonQuantity } from '../../../helpers/functions';

export const addProductToCart = async (product: ProductProjection, quantity: number): Promise<void> => {
  const cartVersion = Number(getFromLS('cartVersion')) || 1;
  const cartID = getFromLS('cartID') as string;

  const updatedCart = await addCartItem(ApiClientBuilder.currentRoot, cartID, cartVersion, product.id, quantity);

  if (!(updatedCart instanceof Error)) {
    updateCartCommonQuantity(updatedCart);
  }
};

export const addProductWithLoading = async (
  button: HTMLButtonElement,
  product: ProductProjection,
  quantity: number,
): Promise<void> => {
  const buttonElement = button;
  buttonElement.classList.add('button--loading');

  await setTimeout(async () => {
    buttonElement.classList.remove('button--loading');
    buttonElement.disabled = true;

    const productKey = buttonElement.closest('.card__link')?.getAttribute('product-key') as string;
    disableQuantityButtons(productKey);
    await addProductToCart(product, quantity);
  }, 2000);
};
