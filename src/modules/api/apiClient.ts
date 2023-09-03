import {
  CustomerSignInResult,
  MyCustomerDraft,
  createApiBuilderFromCtpClient,
  ProductPagedQueryResponse,
  Product,
  ApiRoot,
  Category,
  ProductProjection,
} from '@commercetools/platform-sdk';
import { PasswordAuthMiddlewareOptions } from '@commercetools/sdk-client-v2';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import Toastify from 'toastify-js';
import { buildClientWithPasswordFlow, ctpClient } from './buildClient';

export const apiProjectRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
  projectKey: process.env.CTP_PROJECT_KEY as string,
});

export const createApiRootWithPasswordFlow = (options: PasswordAuthMiddlewareOptions): ByProjectKeyRequestBuilder => {
  const apiRoot = createApiBuilderFromCtpClient(buildClientWithPasswordFlow(options)).withProjectKey({
    projectKey: process.env.CTP_PROJECT_KEY as string,
  });
  return apiRoot;
};

export const createCustomer = async (data: MyCustomerDraft): Promise<MyCustomerDraft | Error> => {
  try {
    const res = await apiProjectRoot
      .me()
      .signup()
      .post({
        body: data,
      })
      .execute();
    const resData = await res.body.customer;
    return resData as MyCustomerDraft;
  } catch (err) {
    console.error();
    return err as Error;
  }
};

export const loginUser = async (
  root: ByProjectKeyRequestBuilder,
  email: string,
  password: string,
): Promise<CustomerSignInResult | object> => {
  let resData = {};
  await root
    .login()
    .post({
      body: {
        email,
        password,
      },
    })
    .execute()
    .then((r) => {
      resData = r.body;
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

  return resData;
};

export const getCategoryId = async (name: string): Promise<string | object> => {
  let resData: string | object = {};
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

export const getProductByCategory = async (id: string | object): Promise<ProductProjection[] | object> => {
  let resData = {};
  await apiProjectRoot
    .productProjections()
    .search()
    .get({
      queryArgs: {
        filter: `categories.id:"${id}"`,
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

export const filterProductsByOrigin = async (country: string): Promise<ProductProjection[] | object> => {
  let resData = {};
  await apiProjectRoot
    .productProjections()
    .search()
    .get({
      queryArgs: {
        filter: [`variants.attributes.Origin.en-US:"${country}"`],
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

export const filterProductsByFlavor = async (flavor: string): Promise<ProductProjection[] | object> => {
  let resData = {};
  await apiProjectRoot
    .productProjections()
    .search()
    .get({
      queryArgs: {
        filter: [`variants.attributes.Flavor.en-US:"${flavor}"`],
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

export const sortProductsByNameAsc = async (): Promise<ProductProjection[] | object> => {
  let resData = {};
  await apiProjectRoot
    .productProjections()
    .search()
    .get({
      queryArgs: {
        sort: ['name.en-us asc'],
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

export const sortProductsByNameDesc = async (): Promise<ProductProjection[] | object> => {
  let resData = {};
  await apiProjectRoot
    .productProjections()
    .search()
    .get({
      queryArgs: {
        sort: ['name.en-us desc'],
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

export const sortProductsByPriceAsc = async (): Promise<ProductProjection[] | object> => {
  let resData = {};
  await apiProjectRoot
    .productProjections()
    .search()
    .get({
      queryArgs: {
        sort: ['price asc'],
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

export const sortProductsByPriceDesc = async (): Promise<ProductProjection[] | object> => {
  let resData = {};
  await apiProjectRoot
    .productProjections()
    .search()
    .get({
      queryArgs: {
        sort: ['price desc'],
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

export const searchProducts = async (str: string): Promise<ProductProjection[] | object> => {
  let resData = {};
  await apiProjectRoot
    .productProjections()
    .search()
    .get({
      queryArgs: {
        'text.en-us': str.toLowerCase(),
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
