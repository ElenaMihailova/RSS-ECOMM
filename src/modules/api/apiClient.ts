import { createApiBuilderFromCtpClient, CustomerSignInResult } from '@commercetools/platform-sdk';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { PasswordAuthMiddlewareOptions } from '@commercetools/sdk-client-v2';
import { buildClientWithPasswordFlow } from './buildClient';

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
  try {
    const res = await root
      .login()
      .post({
        body: {
          email,
          password,
        },
      })
      .execute();
    const resData = await res.body;
    return resData;
  } catch (err) {
    console.log(err);
  }
  return {};
};
