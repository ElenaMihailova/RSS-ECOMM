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

// Configure httpMiddlewareOptions
const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: process.env.CTP_API_URL as string,
  fetch,
};

const buildClientWithPasswordFlow = (options: PasswordAuthMiddlewareOptions): Client => {
  const client = new ClientBuilder()
    .withProjectKey(projectKey) // .withProjectKey() is not required if the projectKey is included in authMiddlewareOptions
    .withPasswordFlow(options)
    .withHttpMiddleware(httpMiddlewareOptions)
    .build();

  return client;
};

export default buildClientWithPasswordFlow;
