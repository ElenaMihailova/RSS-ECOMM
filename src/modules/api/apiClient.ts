import {
  CustomerSignInResult,
  MyCustomerDraft,
  createApiBuilderFromCtpClient,
  Customer,
  CustomerChangePassword,
  CustomerUpdate,
  ProductProjection,
} from '@commercetools/platform-sdk';
import { PasswordAuthMiddlewareOptions } from '@commercetools/sdk-client-v2';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import Toastify from 'toastify-js';
import { buildClientWithPasswordFlow, ctpClient } from './buildClient';
import { QueryArgs, CustomerData } from '../../types/interfaces';

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

export const changePassword = async (body: CustomerChangePassword): Promise<Customer | Error> => {
  try {
    const res = await apiProjectRoot
      .customers()
      .password()
      .post({
        body,
      })
      .execute();
    const resData = await res.body;
    return resData;
  } catch (err) {
    console.error();
    return err as Error;
  }
};

export const getCustomerByID = async (ID: string): Promise<MyCustomerDraft | object> => {
  try {
    const res = await apiProjectRoot.customers().withId({ ID }).get().execute();
    const resData = await res.body;
    return resData;
  } catch (err) {
    console.error(err);
  }
  return {};
};

export const getProductByProductKey = async (key: string): Promise<ProductProjection | object> => {
  let resData = {};
  await apiProjectRoot
    .productProjections()
    .withKey({ key })
    .get()
    .execute()
    .then((r) => {
      resData = r.body;
    })
    .catch((e) => {
      console.error(e.message);
    });
  return resData;
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
      // eslint-disable-next-line prefer-destructuring
      resData = r.body.results[0];
    })
    .catch((e) => {
      console.error(e.message);
    });
  return resData;
};

export const updateCustomer = async (customerId: string, body: CustomerUpdate): Promise<Customer | Error> => {
  try {
    const res = await apiProjectRoot
      .customers()
      .withId({ ID: customerId })
      .post({
        body,
      })
      .execute();
    const resData = await res.body;
    return resData;
  } catch (err) {
    console.error();
    return err as Error;
  }
};

export const getUpdatedCustomer = async (customerID: string): Promise<Customer> => {
  const updatedCustomersData: MyCustomerDraft | object = await getCustomerByID(customerID);
  const data = updatedCustomersData as Customer;
  return data;
};

export const getUpdatedVersion = async (customerID: string): Promise<number | undefined> => {
  const updatedCustomersData: CustomerData | object = await getCustomerByID(customerID);
  const data = updatedCustomersData as CustomerData;
  const { version } = data;

  if (version) {
    return version;
  }

  return version;
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
