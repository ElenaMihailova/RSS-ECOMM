import { ApiRoot, createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import ctpClient from './build-client';

// Create apiRoot from the imported ClientBuilder and include your Project key
const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
  projectKey: process.env.CTP_PROJECT_KEY as string,
});

async function obtainAccessToken(): Promise<void> {
  try {
    const products = apiRoot.products().get().execute();
    console.log(products);
  } catch (err) {
    console.log(err);
  }
}

export default obtainAccessToken;
