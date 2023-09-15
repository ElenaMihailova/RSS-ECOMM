import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import {
  ClientBuilder,
  type HttpMiddlewareOptions,
  PasswordAuthMiddlewareOptions,
  Client,
  AnonymousAuthMiddlewareOptions,
  RefreshAuthMiddlewareOptions,
} from '@commercetools/sdk-client-v2';

const projectKey = process.env.CTP_PROJECT_KEY as string;
export const scopes = process.env.CTP_SCOPES?.split(' ');

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: process.env.CTP_API_URL as string,
  fetch,
};

class ApiClientBuilder {
  public static currentRoot: ByProjectKeyRequestBuilder;

  public static createApiRootWithAnonymousFlow(options: AnonymousAuthMiddlewareOptions): ByProjectKeyRequestBuilder {
    const apiRoot = createApiBuilderFromCtpClient(
      ApiClientBuilder.buildClientWithAnonymousFlow(options),
    ).withProjectKey({
      projectKey: process.env.CTP_PROJECT_KEY as string,
    });

    return apiRoot;
  }

  public static createApiRootWithPasswordFlow = (
    options: PasswordAuthMiddlewareOptions,
  ): ByProjectKeyRequestBuilder => {
    const apiRoot = createApiBuilderFromCtpClient(ApiClientBuilder.buildClientWithPasswordFlow(options)).withProjectKey(
      {
        projectKey: process.env.CTP_PROJECT_KEY as string,
      },
    );

    return apiRoot;
  };

  public static createApiRootWithRefreshFlow = (options: RefreshAuthMiddlewareOptions): ByProjectKeyRequestBuilder => {
    const apiRoot = createApiBuilderFromCtpClient(
      ApiClientBuilder.buildClientWithRefreshTokenFlow(options),
    ).withProjectKey({
      projectKey: process.env.CTP_PROJECT_KEY as string,
    });

    return apiRoot;
  };

  private static buildClientWithAnonymousFlow(options: AnonymousAuthMiddlewareOptions): Client {
    const anonymousClient = new ClientBuilder()
      .withProjectKey(projectKey)
      .withAnonymousSessionFlow(options)
      .withHttpMiddleware(httpMiddlewareOptions)
      .withLoggerMiddleware()
      .build();

    return anonymousClient;
  }

  private static buildClientWithPasswordFlow(options: PasswordAuthMiddlewareOptions): Client {
    const passwordClient = new ClientBuilder()
      .withProjectKey(projectKey)
      .withPasswordFlow(options)
      .withHttpMiddleware(httpMiddlewareOptions)
      .build();

    return passwordClient;
  }

  private static buildClientWithRefreshTokenFlow(options: RefreshAuthMiddlewareOptions): Client {
    const refreshClient = new ClientBuilder()
      .withProjectKey(projectKey)
      .withRefreshTokenFlow(options)
      .withHttpMiddleware(httpMiddlewareOptions)
      .build();

    return refreshClient;
  }
}

export default ApiClientBuilder;
