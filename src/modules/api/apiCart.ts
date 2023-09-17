import { Cart } from '@commercetools/platform-sdk';
import apiProjectRoot from './buildRoot';

const getCartById = async (cartId: string): Promise<Cart> => {
  let resData: Cart | null = null;
  try {
    const response = await apiProjectRoot
      .carts()
      .get({
        queryArgs: {
          where: `id="${cartId}"`,
        },
      })
      .execute();

    [resData] = [...response.body.results];
  } catch (err) {
    console.error(err);
  }

  if (resData === null) {
    throw new Error('Cart not found or another error occurred');
  }

  return resData;
};

export default getCartById;
