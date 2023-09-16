import {
  AnonymousCartSignInMode,
  Customer,
  CustomerChangePassword,
  CustomerUpdate,
  MyCustomerDraft,
  MyCustomerSignin,
} from '@commercetools/platform-sdk';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import Toastify from 'toastify-js';
import { CustomerData } from '../../types/interfaces';

export const createCustomer = async (
  apiProjectRoot: ByProjectKeyRequestBuilder,
  data: MyCustomerDraft,
): Promise<MyCustomerDraft | Error> => {
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

export const changePassword = async (
  apiProjectRoot: ByProjectKeyRequestBuilder,
  body: CustomerChangePassword,
): Promise<Customer | Error> => {
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

export const getCustomerByID = async (
  apiProjectRoot: ByProjectKeyRequestBuilder,
  ID: string,
): Promise<MyCustomerDraft | object> => {
  try {
    const res = await apiProjectRoot.customers().withId({ ID }).get().execute();
    const resData = await res.body;
    return resData;
  } catch (err) {
    console.error(err);
  }
  return {};
};

export const updateCustomer = async (
  apiProjectRoot: ByProjectKeyRequestBuilder,
  customerId: string,
  body: CustomerUpdate,
): Promise<Customer | Error> => {
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

export const getUpdatedCustomer = async (
  apiProjectRoot: ByProjectKeyRequestBuilder,
  customerID: string,
): Promise<Customer> => {
  const updatedCustomersData: MyCustomerDraft | object = await getCustomerByID(apiProjectRoot, customerID);
  const data = updatedCustomersData as Customer;
  return data;
};

export const getUpdatedVersion = async (
  apiProjectRoot: ByProjectKeyRequestBuilder,
  customerID: string,
): Promise<number | undefined> => {
  const updatedCustomersData: CustomerData | object = await getCustomerByID(apiProjectRoot, customerID);
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
  activeCartSignInMode: AnonymousCartSignInMode,
  updateProductData: boolean,
): Promise<MyCustomerSignin | object> => {
  let resData = {};
  await root
    .me()
    .login()
    .post({
      body: {
        email,
        password,
        activeCartSignInMode,
        updateProductData,
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
