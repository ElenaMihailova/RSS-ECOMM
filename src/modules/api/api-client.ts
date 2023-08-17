import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { CustomersFromApi } from '../../types';
import ctpClient from './build-client';

// Create apiRoot from the imported ClientBuilder and include your Project key
const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
  projectKey: process.env.CTP_PROJECT_KEY as string,
});

async function getEndpoint(): Promise<CustomersFromApi> {
  let resData: CustomersFromApi = {};
  try {
    const res = await apiRoot.customers().get().execute();
    resData = await res.body;
  } catch (err) {
    console.log(err);
  }
  return resData;
}

export default getEndpoint;
