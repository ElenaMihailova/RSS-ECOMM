import { ApiRoot, createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import ctpClient from './buildClient';

// Create apiRoot from the imported ClientBuilder and include your Project key
const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
  projectKey: process.env.CTP_PROJECT_KEY as string,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getEndpoint = (): any => {
  return apiRoot
    .customers()
    .get()
    .execute()
    .then(({ body }) => {
      console.log(JSON.stringify(body));
    })
    .catch(console.error);
};

export default getEndpoint;
