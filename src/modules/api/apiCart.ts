import { Cart } from '@commercetools/platform-sdk';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
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
    if ('version' in resData) {
      removeFromLS('cartVersion');
      setToLS('cartVersion', JSON.stringify(resData.version));
    }
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
      console.error(error.message);
    }
    console.error('Error fetching active cart:', error);
    throw error;
  }
};

export const removeCart = async (
  root: ByProjectKeyRequestBuilder,
  cartId: string,
  cartVersion: number,
): Promise<Cart | Error> => {
  try {
    const res = await root
      .me()
      .carts()
      .withId({ ID: cartId })
      .delete({
        queryArgs: {
          version: cartVersion,
        },
      })
      .execute();
    const resData = await res.body;
    removeFromLS('cartVersion');
    removeFromLS('cartID');
    return resData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const removeAllItemsFromCart = async (
  root: ByProjectKeyRequestBuilder,
  cartID: string,
  cartVersion: number,
): Promise<Cart | Error> => {
  try {
    const res = await root
      .me()
      .carts()
      .withId({ ID: cartID })
      .delete({
        queryArgs: {
          version: cartVersion,
        },
      })
      .execute();
    const resData = await res.body;
    removeFromLS('cartVersion');
    removeFromLS('cartID');
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
              action: 'removeLineItem',
              lineItemId,
              quantity,
            },
          ],
        },
      })
      .execute();
    const resData = await res.body;
    if ('version' in resData) {
      removeFromLS('cartVersion');
      setToLS('cartVersion', JSON.stringify(resData.version));
    }
    return resData;
  } catch (err) {
    console.error(err);
    return err as Error;
  }
};
