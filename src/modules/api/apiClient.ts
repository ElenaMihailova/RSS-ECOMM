import {
  Customer,
  CustomerSignInResult,
  MyCustomerDraft,
  createApiBuilderFromCtpClient,
} from '@commercetools/platform-sdk';
import { PasswordAuthMiddlewareOptions } from '@commercetools/sdk-client-v2';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import Toastify from 'toastify-js';
import { buildClientWithPasswordFlow, ctpClient } from './buildClient';
import { BaseAddress, CustomerData } from '../../types/interfaces';

const apiProjectRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
  projectKey: process.env.CTP_PROJECT_KEY as string,
});

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

export const updateFirstName = async (
  customerId: string,
  value: string,
  customerVersion: number,
): Promise<MyCustomerDraft | object> => {
  try {
    const res = await apiProjectRoot
      .customers()
      .withId({ ID: customerId })
      .post({
        body: {
          version: customerVersion,
          actions: [
            {
              action: 'setFirstName',
              firstName: value,
            },
          ],
        },
      })
      .execute();
    const resData = await res.body;
    return resData;
  } catch (err) {
    console.error(err);
  }
  return {};
};

export const updateLastName = async (
  customerId: string,
  value: string,
  customerVersion: number,
): Promise<MyCustomerDraft | object> => {
  try {
    const res = await apiProjectRoot
      .customers()
      .withId({ ID: customerId })
      .post({
        body: {
          version: customerVersion,
          actions: [
            {
              action: 'setLastName',
              lastName: value,
            },
          ],
        },
      })
      .execute();
    const resData = await res.body;
    return resData;
  } catch (err) {
    console.error(err);
  }
  return {};
};

export const updateDateOfBirth = async (
  customerId: string,
  value: string,
  customerVersion: number,
): Promise<MyCustomerDraft | object> => {
  try {
    const res = await apiProjectRoot
      .customers()
      .withId({ ID: customerId })
      .post({
        body: {
          version: customerVersion,
          actions: [
            {
              action: 'setDateOfBirth',
              dateOfBirth: value,
            },
          ],
        },
      })
      .execute();
    const resData = await res.body;
    return resData;
  } catch (err) {
    console.error(err);
  }
  return {};
};

export const updateEmailAddress = async (
  customerId: string,
  value: string,
  customerVersion: number,
): Promise<MyCustomerDraft | object> => {
  try {
    const res = await apiProjectRoot
      .customers()
      .withId({ ID: customerId })
      .post({
        body: {
          version: customerVersion,
          actions: [
            {
              action: 'changeEmail',
              email: value,
            },
          ],
        },
      })
      .execute();
    const resData = await res.body;
    return resData;
  } catch (err) {
    console.error(err);
  }
  return {};
};

export const updateAddress = async (
  customerId: string,
  customerVersion: number,
  addressId: string,
  address: BaseAddress,
): Promise<MyCustomerDraft | object> => {
  try {
    const res = await apiProjectRoot
      .customers()
      .withId({ ID: customerId })
      .post({
        body: {
          version: customerVersion,
          actions: [
            {
              action: 'changeAddress',
              addressId,
              address,
            },
          ],
        },
      })
      .execute();
    const resData = await res.body;
    return resData;
  } catch (err) {
    console.error(err);
  }
  return {};
};

export const addNewAddress = async (
  customerId: string,
  customerVersion: number,
  address: BaseAddress,
): Promise<Customer | object> => {
  try {
    const res = await apiProjectRoot
      .customers()
      .withId({ ID: customerId })
      .post({
        body: {
          version: customerVersion,
          actions: [
            {
              action: 'addAddress',
              address,
            },
          ],
        },
      })
      .execute();
    const resData = await res.body;
    return resData;
  } catch (err) {
    console.error(err);
  }
  return {};
};

export const removeAddress = async (
  customerId: string,
  customerVersion: number,
  addressId: string,
): Promise<Customer | object> => {
  try {
    const res = await apiProjectRoot
      .customers()
      .withId({ ID: customerId })
      .post({
        body: {
          version: customerVersion,
          actions: [
            {
              action: 'removeAddress',
              addressId,
            },
          ],
        },
      })
      .execute();
    const resData = await res.body;
    return resData;
  } catch (err) {
    console.error(err);
  }
  return {};
};

export const removeShippingAddress = async (
  customerId: string,
  customerVersion: number,
  addressId: string,
): Promise<MyCustomerDraft | object> => {
  try {
    const res = await apiProjectRoot
      .customers()
      .withId({ ID: customerId })
      .post({
        body: {
          version: customerVersion,
          actions: [
            {
              action: 'removeShippingAddressId',
              addressId,
            },
          ],
        },
      })
      .execute();
    const resData = await res.body;
    console.log(`delete shipping ${addressId}`, resData);
    return resData;
  } catch (err) {
    console.error(err);
  }
  return {};
};

export const removeBillingAddress = async (
  customerId: string,
  customerVersion: number,
  addressId: string,
): Promise<MyCustomerDraft | object> => {
  try {
    const res = await apiProjectRoot
      .customers()
      .withId({ ID: customerId })
      .post({
        body: {
          version: customerVersion,
          actions: [
            {
              action: 'removeBillingAddressId',
              addressId,
            },
          ],
        },
      })
      .execute();
    const resData = await res.body;
    console.log(`delete billing ${addressId}`, resData);
    return resData;
  } catch (err) {
    console.error(err);
  }
  return {};
};

export const addShippingAddress = async (
  customerId: string,
  customerVersion: number,
  addressId: string,
): Promise<MyCustomerDraft | object> => {
  try {
    const res = await apiProjectRoot
      .customers()
      .withId({ ID: customerId })
      .post({
        body: {
          version: customerVersion,
          actions: [
            {
              action: 'addShippingAddressId',
              addressId,
            },
          ],
        },
      })
      .execute();
    const resData = await res.body;
    console.log(`добавили шипинг ${addressId}`, resData);
    return resData;
  } catch (err) {
    console.error(err);
  }
  return {};
};

export const addBillingAddress = async (
  customerId: string,
  customerVersion: number,
  addressId: string,
): Promise<MyCustomerDraft | object> => {
  try {
    const res = await apiProjectRoot
      .customers()
      .withId({ ID: customerId })
      .post({
        body: {
          version: customerVersion,
          actions: [
            {
              action: 'addBillingAddressId',
              addressId,
            },
          ],
        },
      })
      .execute();
    const resData = await res.body;
    console.log(`добавили billing ${addressId}`, resData);
    return resData;
  } catch (err) {
    console.error(err);
  }
  return {};
};

export const setDefaultShippingAddress = async (
  customerId: string,
  customerVersion: number,
  addressId: string | undefined,
): Promise<MyCustomerDraft | object> => {
  try {
    const res = await apiProjectRoot
      .customers()
      .withId({ ID: customerId })
      .post({
        body: {
          version: customerVersion,
          actions: [
            {
              action: 'setDefaultShippingAddress',
              addressId,
            },
          ],
        },
      })
      .execute();
    const resData = await res.body;
    console.log(`добавили billing ${addressId}`, resData);
    return resData;
  } catch (err) {
    console.error(err);
  }
  return {};
};

export const setDefaultBillingAddress = async (
  customerId: string,
  customerVersion: number,
  addressId: string | undefined,
): Promise<MyCustomerDraft | object> => {
  try {
    const res = await apiProjectRoot
      .customers()
      .withId({ ID: customerId })
      .post({
        body: {
          version: customerVersion,
          actions: [
            {
              action: 'setDefaultBillingAddress',
              addressId,
            },
          ],
        },
      })
      .execute();
    const resData = await res.body;
    console.log(`добавили billing ${addressId}`, resData);
    return resData;
  } catch (err) {
    console.error(err);
  }
  return {};
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

export const createApiRootWithPasswordFlow = (options: PasswordAuthMiddlewareOptions): ByProjectKeyRequestBuilder => {
  const apiRoot = createApiBuilderFromCtpClient(buildClientWithPasswordFlow(options)).withProjectKey({
    projectKey: process.env.CTP_PROJECT_KEY as string,
  });
  return apiRoot;
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
