import {
  ClientBuilder,
  // Import middlewares
  type HttpMiddlewareOptions,
  PasswordAuthMiddlewareOptions,
  Client,
  TokenCache,
} from '@commercetools/sdk-client-v2';

const projectKey = process.env.CTP_PROJECT_KEY as string;
const scopes = process.env.CTP_SCOPES?.split(' ');
const usrname = 'johndoe123123@example.com';
const usrpassword = 'secret123123123';

const passwordAuthMiddlewareOptions: PasswordAuthMiddlewareOptions = {
  host: process.env.CTP_AUTH_URL as string,
  projectKey,
  credentials: {
    clientId: process.env.CTP_CLIENT_ID as string,
    clientSecret: process.env.CTP_CLIENT_SECRET as string,
    user: {
      username: usrname,
      password: usrpassword,
    },
  },
  scopes,
  fetch,
};

// Configure httpMiddlewareOptions
const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: process.env.CTP_API_URL as string,
  fetch,
};

// Export the ClientBuilder
export const ctpClient = new ClientBuilder()
  .withProjectKey(projectKey) // .withProjectKey() is not required if the projectKey is included in authMiddlewareOptions
  .withPasswordFlow(passwordAuthMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .build();

export const buildClientWithPasswordFlow = (options: PasswordAuthMiddlewareOptions): Client => {
  const client = new ClientBuilder()
    .withProjectKey(projectKey) // .withProjectKey() is not required if the projectKey is included in authMiddlewareOptions
    .withPasswordFlow(options)
    .withHttpMiddleware(httpMiddlewareOptions)
    .build();

  return client;
};
