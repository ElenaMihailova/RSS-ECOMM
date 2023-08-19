import { ApiRoot, createApiBuilderFromCtpClient, CustomerSignInResult } from '@commercetools/platform-sdk';
import ctpClient from './build-client';

// Create apiRoot from the imported ClientBuilder and include your Project key
const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
  projectKey: process.env.CTP_PROJECT_KEY as string,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// async function getAccessToken(email: string, password: string): Promise<any> {
//   try {
//     const res = await fetch(
//       `https://auth.europe-west1.gcp.commercetools.com/oauth/${process.env.CTP_PROJECT_KEY}/customers/token`,
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//           Authorization: `Basic ${btoa(`${process.env.CTP_CLIENT_ID}:${process.env.CTP_CLIENT_SECRET}`)}`,
//         },
//         body: `grant_type=password&username=${email}&password=${password}&scope=view_published_products:${process.env.CTP_PROJECT_KEY}`,
//       },
//     );
//     const resData = await res.json();
//     console.log(resData);
//     return resData;
//   } catch (err) {
//     console.log(err);
//   }
//   return {};
// }

// export default getAccessToken;

const getAccessToken = async (email: string, password: string): Promise<CustomerSignInResult | object> => {
  try {
    const token = btoa(`${process.env.CTP_CLIENT_ID}:${process.env.CTP_CLIENT_SECRET}`);
    console.log(token);
    const res = await apiRoot
      .login()
      .post({
        body: {
          email,
          password,
        },
        // headers: {
        //   Authorization: `Bearer ${token}`,
        //   'Content-Type': 'application/x-www-form-urlencoded',
        // },
      })
      .execute();
    const resData = await res.body;
    console.log(resData);
    return resData;
  } catch (err) {
    console.error(err);
  }
  return {};
};

export default getAccessToken;
