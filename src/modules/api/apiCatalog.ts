import { ProductProjection } from '@commercetools/platform-sdk';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { QueryArgs } from '../../types/interfaces';

export const getProductByProductKey = async (
  apiProjectRoot: ByProjectKeyRequestBuilder,
  key: string,
): Promise<ProductProjection | null> => {
  try {
    const res = await apiProjectRoot.productProjections().withKey({ key }).get().execute();
    const resData = await res.body;
    return resData;
  } catch (err) {
    console.error(err);
  }
  return null;
};

export const getProductByProductUrl = async (
  apiProjectRoot: ByProjectKeyRequestBuilder,
  url: string,
): Promise<ProductProjection | object> => {
  let resData = {};
  await apiProjectRoot
    .productProjections()
    .get({
      queryArgs: {
        where: `slug(en-US="${url}")`,
      },
    })
    .execute()
    .then((r) => {
      [resData] = [...r.body.results];
    })
    .catch((e) => {
      console.error(e.message);
    });
  return resData;
};

export const getProductProjections = async (
  apiProjectRoot: ByProjectKeyRequestBuilder,
  queryArgs?: QueryArgs,
): Promise<ProductProjection[]> => {
  const query = queryArgs || {
    withTotal: true,
  };
  let resData: ProductProjection[] = [];
  await apiProjectRoot
    .productProjections()
    .get({
      queryArgs: query,
    })
    .execute()
    .then((r) => {
      resData = r.body.results;
    })
    .catch((e) => {
      console.error(e.message);
    });

  return resData;
};

export const getCategoryId = async (apiProjectRoot: ByProjectKeyRequestBuilder, name: string): Promise<string> => {
  let resData = '';
  await apiProjectRoot
    .categories()
    .get({
      queryArgs: {
        where: `name(en-US="${name}")`,
      },
    })
    .execute()
    .then((r) => {
      resData = r.body.results[0].id;
    })
    .catch((e) => {
      console.error(e.message);
    });
  return resData;
};

export const filterProducts = async (
  apiProjectRoot: ByProjectKeyRequestBuilder,
  queryArgs: QueryArgs,
): Promise<ProductProjection[]> => {
  let resData: ProductProjection[] = [];
  await apiProjectRoot
    .productProjections()
    .search()
    .get({
      queryArgs,
    })
    .execute()
    .then((r) => {
      resData = r.body.results;
    })
    .catch((e) => {
      console.error(e.message);
    });

  return resData;
};

export const getCategoryName = async (apiProjectRoot: ByProjectKeyRequestBuilder, id: string): Promise<string> => {
  let resData = '';
  await apiProjectRoot
    .categories()
    .get({
      queryArgs: {
        where: `id="${id}"`,
      },
    })
    .execute()
    .then((r) => {
      resData = r.body.results[0].name['en-US'];
    })
    .catch((e) => {
      console.error(e.message);
    });
  return resData;
};
