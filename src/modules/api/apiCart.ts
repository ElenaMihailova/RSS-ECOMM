import { Cart } from '@commercetools/platform-sdk';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { CartProduct } from '../../types/interfaces';
import { setToLS } from '../helpers/functions';

export const createCart = async (root: ByProjectKeyRequestBuilder): Promise<Cart | Error> => {
  try {
    const res = await root
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
  quantity = 1,
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
