import {
  ClientBuilder,
  // Import middlewares
  type HttpMiddlewareOptions,
  PasswordAuthMiddlewareOptions,
  Client,
  AuthMiddlewareOptions,
} from '@commercetools/sdk-client-v2';

const projectKey = process.env.CTP_PROJECT_KEY as string;
const scopes = process.env.CTP_SCOPES?.split(' ');

// Configure httpMiddlewareOptions
const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: process.env.CTP_API_URL as string,
  fetch,
};

const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: process.env.CTP_AUTH_URL as string,
  projectKey: process.env.CTP_PROJECT_KEY as string,
  credentials: {
    clientId: process.env.CTP_CLIENT_ID as string,
    clientSecret: process.env.CTP_CLIENT_SECRET as string,
  },
  scopes,
  fetch,
};

export const ctpClient = new ClientBuilder()
  .withProjectKey(projectKey) // .withProjectKey() is not required if the projectKey is included in authMiddlewareOptions
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware() // Include middleware for logging
  .build();

export const buildClientWithPasswordFlow = (options: PasswordAuthMiddlewareOptions): Client => {
  const client = new ClientBuilder()
    .withProjectKey(projectKey) // .withProjectKey() is not required if the projectKey is included in authMiddlewareOptions
    .withPasswordFlow(options)
    .withHttpMiddleware(httpMiddlewareOptions)
    .build();

  return client;
};
