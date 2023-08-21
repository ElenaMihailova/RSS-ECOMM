import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { CustomersFromApi } from '../../types/types';
import ctpClient from './build-client';

// Create apiRoot from the imported ClientBuilder and include your Project key
const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
  projectKey: process.env.CTP_PROJECT_KEY as string,
});

async function getEndpoint(): Promise<CustomersFromApi> {
  try {
    const res = await apiRoot.customers().get().execute();
    const resData: CustomersFromApi = await res.body;
    return resData;
  } catch (err) {
    console.error(err);
  }
  return {};
}

export default getEndpoint;
