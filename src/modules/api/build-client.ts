import fetch from 'node-fetch';

import {
  ClientBuilder,
  // Import middlewares
  type AuthMiddlewareOptions, // Required for auth
  type PasswordAuthMiddlewareOptions, // Required for auth
  type HttpMiddlewareOptions, // Required for sending HTTP requests
} from '@commercetools/sdk-client-v2';

const projectKey = process.env.CTP_PROJECT_KEY as string;
const scopes = process.env.CTP_SCOPES?.split(' ');

const usrname = 'johndoe@example.com';
const usrpassword = 'rss2023Q1!';

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
  scopes: [`view_published_products:${projectKey}`],
  fetch,
};

// Configure httpMiddlewareOptions
const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: process.env.CTP_API_URL as string,
  fetch,
};

export const withPasswordFlowClient = (email: string, pass: string): void => {
  const options: PasswordAuthMiddlewareOptions = {
    host: process.env.CTP_AUTH_URL as string,
    projectKey,
    credentials: {
      clientId: process.env.CTP_CLIENT_ID as string,
      clientSecret: process.env.CTP_CLIENT_SECRET as string,
      user: {
        username: email,
        password: pass,
      },
    },
    scopes: [`view_published_products:${projectKey}`],
    fetch,
  };

  const clientWithPasswordFlow = new ClientBuilder()
    .withProjectKey(projectKey) // .withProjectKey() is not required if the projectKey is included in authMiddlewareOptions
    .withPasswordFlow(passwordAuthMiddlewareOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware() // Include middleware for logging
    .build();
};

// Export the ClientBuilder
const ctpClient = new ClientBuilder()
  .withProjectKey(projectKey) // .withProjectKey() is not required if the projectKey is included in authMiddlewareOptions
  .withPasswordFlow(passwordAuthMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware() // Include middleware for logging
  .build();

export default ctpClient;
