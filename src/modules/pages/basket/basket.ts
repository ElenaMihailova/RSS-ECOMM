import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { AnonymousAuthMiddlewareOptions, RefreshAuthMiddlewareOptions } from '@commercetools/sdk-client-v2';
import { Cart } from '@commercetools/platform-sdk';
import { getActiveCart, getProductProjections, removeAllItemsFromCart } from '../../api';
import ApiClientBuilder, { scopes } from '../../api/buildRoot';
import { createElement, getFromLS, setToLS } from '../../helpers/functions';
import basketItems from './basketItems';
import basketSum from './sumBasket';
import MyTokenCache from '../../api/myTokenCache';

const emptyBasket = (): HTMLElement => {
  const items = createElement({
    tagName: 'div',
    classNames: ['cart__items', 'items', 'items--empty', 'container'],
  });
  createElement({ tagName: 'p', text: 'Your basket is waiting to be filled.', parent: items });
  createElement({ tagName: 'p', text: 'Choose the tea that will warm your day!', parent: items });
  createElement({
    tagName: 'a',
    text: 'Tea collections',
    classNames: ['button'],
    attributes: [{ href: 'catalog' }],
    parent: items,
  });

  return items;
};

interface EmptyCart {
  isEmpty: true;
}

async function setupApiClient(isRefreshToken: boolean): Promise<Cart | Error | EmptyCart> {
  try {
    const tokenCache = new MyTokenCache();
    const baseOptions = {
      host: process.env.CTP_AUTH_URL as string,
      projectKey: process.env.CTP_PROJECT_KEY as string,
      credentials: {
        clientId: process.env.CTP_CLIENT_ID as string,
        clientSecret: process.env.CTP_CLIENT_SECRET as string,
      },
      tokenCache,
      fetch,
    };

    if (isRefreshToken) {
      ApiClientBuilder.currentRoot = ApiClientBuilder.createApiRootWithRefreshFlow({
        ...baseOptions,
        refreshToken: getFromLS('refreshToken') as string,
      });
    } else {
      ApiClientBuilder.currentRoot = ApiClientBuilder.createApiRootWithAnonymousFlow({
        ...baseOptions,
        scopes,
      });
    }

    const cart = await getActiveCart(ApiClientBuilder.currentRoot);

    const tokenInfo = tokenCache.get();
    if (tokenInfo.token) {
      setToLS('token', tokenInfo.token);
    }
    if (!isRefreshToken && tokenInfo.refreshToken) {
      setToLS('refreshToken', tokenInfo.refreshToken);
    }

    return cart;
  } catch (err) {
    if (err instanceof Error && 'statusCode' in err && err.statusCode === 404) {
      return { isEmpty: true };
    }
    return err as Error;
  }
}

async function initializeApiClient(): Promise<Cart | Error | EmptyCart> {
  if (getFromLS('refreshToken')) {
    return setupApiClient(true);
  }
  return setupApiClient(false);
}

const basket = async (): Promise<HTMLElement> => {
  const cart = await initializeApiClient();
  if (cart instanceof Error) {
    throw cart;
  }

  const items = createElement({ tagName: 'div', classNames: ['cart__items', 'items', 'container'] });

  if ('isEmpty' in cart && cart.isEmpty) {
    return emptyBasket();
  }

  items.appendChild(basketItems(cart as Cart));
  items.appendChild(createElement({ tagName: 'div', classNames: ['sum__line'] }));
  const wrapItem = createElement({
    tagName: 'div',
    classNames: ['sum__wrap', 'titleMonserrat--medium'],
    parent: items,
  });

  createElement({
    tagName: 'p',
    classNames: ['sum__subtotal', 'titleMonserrat--medium'],
    html: 'Subtotal',
    parent: wrapItem,
  });
  createElement({ tagName: 'p', classNames: ['sum__amount'], html: `€3.90`, parent: wrapItem });
  createElement({
    tagName: 'a',
    classNames: ['sum__link', 'button'],
    text: 'Back to shopping',
    attributes: [{ href: 'catalog' }],
    parent: items,
  });
  const clearCartBtn = createElement({
    tagName: 'button',
    classNames: ['sum__clear', 'button'],
    id: 'clearCartBtn',
    text: 'Clear Cart',
    parent: items,
  });

  // clearCartBtn.addEventListener('click', function () {
  //   removeAllItemsFromCart(cart.root, cart.cartID, cart.cartVersion);
  // });

  items.appendChild(basketSum());

  return items;
};

export default basket;
