import { Cart } from '@commercetools/platform-sdk';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import Toastify from 'toastify-js';
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
  productId: string,
  quantity: number,
): Promise<Cart | Error> => {
  try {
    const res = await root
      .me()
      .carts()
      .withId({ ID: cartID })
      .post({
        body: {
          version: cartVersion,
          actions: [
            {
              action: 'addLineItem',
              productId,
              quantity,
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
  } catch (err) {
    console.error(err);
    return err as Error;
  }
};

export const removeItemFromCart = async (
  root: ByProjectKeyRequestBuilder,
  cartID: string,
  cartVersion: number,
  lineItemId: string,
  quantity: number,
): Promise<Cart | object> => {
  let resData: object | Cart = {};
  await root
    .me()
    .carts()
    .withId({ ID: cartID })
    .post({
      body: {
        version: cartVersion,
        actions: [
          {
            action: 'removeLineItem',
            lineItemId,
            quantity,
          },
        ],
      },
    })
    .execute()
    .then((r) => {
      resData = r.body;
      if ('version' in resData) {
        removeFromLS('cartVersion');
        setToLS('cartVersion', JSON.stringify(resData.version));
      }
      Toastify({
        text: 'Product has been removed from cart',
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
        className: 'toastify toastify-success',
        duration: 4000,
        newWindow: true,
        close: true,
        gravity: 'bottom',
        position: 'center',
        stopOnFocus: true,
      }).showToast();
    });

  return resData;
};
