import { CustomerSignInResult, MyCustomerDraft, createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { PasswordAuthMiddlewareOptions } from '@commercetools/sdk-client-v2';

import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';

// Create apiRoot from the imported ClientBuilder and include your Project key
import Toastify from 'toastify-js';
import { buildClientWithPasswordFlow, ctpClient } from './BuildClient';

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
  const res = await root
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
