import { TokenCache, TokenStore } from '@commercetools/sdk-client-v2/dist/declarations/src/types/sdk';

class MyTokenCache implements TokenCache {
  public myCaсhe: TokenStore = {
    token: '',
    expirationTime: 0,
    refreshToken: '',
  };

  public set(cache: TokenStore): void {
    this.myCaсhe = cache;
  }

  public get(): TokenStore {
    return this.myCaсhe;
  }
}

export default MyTokenCache;
