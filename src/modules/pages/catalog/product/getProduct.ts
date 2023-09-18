import { ProductProjection } from '@commercetools/platform-sdk';
import { AnonymousAuthMiddlewareOptions, RefreshAuthMiddlewareOptions } from '@commercetools/sdk-client-v2';
import { getCategoryName, getProductByProductUrl } from '../../../api';
import { ProductData } from '../../../../types/interfaces';
import ApiClientBuilder, { scopes } from '../../../api/buildRoot';
import { getFromLS, setToLS } from '../../../helpers/functions';
import MyTokenCache from '../../../api/myTokenCache';

export const getProductCategoryName = async (id: string): Promise<string> => {
  const categoryName = await getCategoryName(ApiClientBuilder.currentRoot, id);
  return categoryName;
};

export const getProduct = async (link: string): Promise<ProductData> => {
  let response = null;

  if (!getFromLS('refreshToken')) {
    const tokenCache = new MyTokenCache();

    const options: AnonymousAuthMiddlewareOptions = {
      host: process.env.CTP_AUTH_URL as string,
      projectKey: process.env.CTP_PROJECT_KEY as string,
      credentials: {
        clientId: process.env.CTP_CLIENT_ID as string,
        clientSecret: process.env.CTP_CLIENT_SECRET as string,
      },
      tokenCache,
      scopes,
      fetch,
    };

    ApiClientBuilder.currentRoot = ApiClientBuilder.createApiRootWithAnonymousFlow(options);

    response = await getProductByProductUrl(ApiClientBuilder.currentRoot, link);

    const tokenInfo = tokenCache.get();

    if (tokenInfo.token) {
      setToLS('token', tokenInfo.token);
    }

    if (tokenInfo.refreshToken) {
      setToLS('refreshToken', tokenInfo.refreshToken);
    }
  } else {
    const tokenCache = new MyTokenCache();

    const options: RefreshAuthMiddlewareOptions = {
      host: process.env.CTP_AUTH_URL as string,
      projectKey: process.env.CTP_PROJECT_KEY as string,
      credentials: {
        clientId: process.env.CTP_CLIENT_ID as string,
        clientSecret: process.env.CTP_CLIENT_SECRET as string,
      },
      refreshToken: getFromLS('refreshToken') as string,
      tokenCache,
      fetch,
    };

    ApiClientBuilder.currentRoot = ApiClientBuilder.createApiRootWithRefreshFlow(options);

    response = await getProductByProductUrl(ApiClientBuilder.currentRoot, link);

    const tokenInfo = tokenCache.get();

    if (tokenInfo.token) {
      setToLS('token', tokenInfo.token);
    }
  }

  const product = response as ProductProjection;

  const price =
    product.masterVariant.prices && product.masterVariant.prices[0]
      ? product.masterVariant.prices[0].value.centAmount / 100
      : 0;

  const discount =
    product.masterVariant.prices && product.masterVariant.prices[0] && product.masterVariant.prices[0].discounted
      ? product.masterVariant.prices[0].discounted.value.centAmount / 100
      : price;

  const description = product.description && product.description['en-US'] ? product.description['en-US'] : '';

  const categories: string[] = [];

  const imageURLs: string[] = [];

  if (product.masterVariant.images) {
    product.masterVariant.images.forEach((image) => {
      imageURLs.push(image.url);
    });
  }

  for await (const category of product.categories) {
    const { id } = category;
    const categoryName = await getProductCategoryName(id);
    categories.push(categoryName);
  }

  const productData: ProductData = {
    link: product.slug['en-US'],
    title: product.name['en-US'],
    price,
    discount,
    categories,
    description,
    imageURLs,
    details: product.masterVariant.attributes,
  };

  return productData;
};
