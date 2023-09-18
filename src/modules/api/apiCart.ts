import { Cart } from '@commercetools/platform-sdk';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import Toastify from 'toastify-js';
import { CartProduct } from '../../types/interfaces';
import { removeFromLS, setToLS } from '../helpers/functions';

export const createCart = async (root: ByProjectKeyRequestBuilder): Promise<Cart | Error> => {
  try {
    const res = await root
      .me()
      .carts()
      .post({
        body: {
          currency: 'EUR',
        },
      })
      .execute();
    const resData = await res.body;
    return resData;
  } catch (err) {
    console.error();
    return err as Error;
  }
};

export const addCartItem = async (
  root: ByProjectKeyRequestBuilder,
  cartID: string,
  cartVersion: number,
  product: CartProduct,
  quantity: number,
): Promise<Cart | Error> => {
  try {
    const res = await root
      .carts()
      .withId({ ID: cartID })
      .post({
        body: {
          version: cartVersion,
          actions: [
            {
              action: 'addCustomLineItem',
              name: {
                en: product.name,
              },
              quantity,
              money: {
                currencyCode: 'EUR',
                centAmount: product.centAmount,
              },
              slug: product.slug,
              taxCategory: {
                typeId: 'tax-category',
                id: product.taxCategoryID,
              },
            },
          ],
        },
      })
      .execute();
    const resData = await res.body;
    setToLS('cartVersion', JSON.stringify(res.body.version));
    return resData;
  } catch (err) {
    console.error();
    return err as Error;
  }
};

export const getActiveCart = async (root: ByProjectKeyRequestBuilder): Promise<Cart | Error> => {
  try {
    const res = await root.me().activeCart().get().execute();
    const resData = await res.body;
    return resData;
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'message' in error) {
      console.log(error.message);
    }
    console.error('Error fetching active cart:', error);
    throw error;
  }
};

export const removeAllItemsFromCart = async (
  root: ByProjectKeyRequestBuilder,
  cartID: string,
  cartVersion: number,
): Promise<void> => {
  await root
    .me()
    .carts()
    .withId({ ID: cartID })
    .delete({
      queryArgs: {
        version: cartVersion,
      },
    })
    .execute()
    .then(() => {
      removeFromLS('cartVersion');
      Toastify({
        text: 'Cart has been emptied',
        className: 'toastify toastify-success',
        duration: 4000,
        newWindow: true,
        close: true,
        gravity: 'bottom',
        position: 'center',
        stopOnFocus: true,
      }).showToast();
    })
    .catch((e) => {
      Toastify({
        text: e.message,
        className: 'toastify toastify-error',
        duration: 4000,
        newWindow: true,
        close: true,
        gravity: 'bottom',
        position: 'center',
        stopOnFocus: true,
      }).showToast();
    });
};
