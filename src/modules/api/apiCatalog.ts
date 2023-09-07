import { ProductProjection } from '@commercetools/platform-sdk';
import { apiProjectRoot } from './buildRoot';
import { QueryArgs } from '../../types/interfaces';

export const getProductByProductKey = async (key: string): Promise<ProductProjection | null> => {
  try {
    const res = await apiProjectRoot.productProjections().withKey({ key }).get().execute();
    const resData = await res.body;
    return resData;
  } catch (err) {
    console.error(err);
  }
  return null;
};

export const getProductByProductUrl = async (url: string): Promise<ProductProjection | object> => {
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

export const getProductProjections = async (): Promise<ProductProjection[]> => {
  let resData: ProductProjection[] = [];
  await apiProjectRoot
    .productProjections()
    .get()
    .execute()
    .then((r) => {
      resData = r.body.results;
    })
    .catch((e) => {
      console.error(e.message);
    });

  return resData;
};

export const getCategoryId = async (name: string): Promise<string> => {
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

export const getProductsByCategory = async (id: string): Promise<ProductProjection[]> => {
  let resData: ProductProjection[] = [];
  await apiProjectRoot
    .productProjections()
    .search()
    .get({
      queryArgs: {
        filter: [`categories.id:"${id}"`],
      },
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

export const filterProducts = async (queryArgs: QueryArgs): Promise<ProductProjection[]> => {
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

export const getCategoryName = async (id: string): Promise<string> => {
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
