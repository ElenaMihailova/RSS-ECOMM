export type RouteAction = {
  path: string;
  callback: () => void;
};

export type UserRequest = {
  path: string;
  resource?: string;
};

export type CustomersFromApi = {
  limit: number;
  offset: number;
  count: number;
  total: number;
  results: CustomersResults[];
};

type CustomersResults = {
  id: string;
  version: number;
  versionModifiedAt: string;
  lastMessageSequenceNumber: number;
  createdAt: string;
  lastModifiedAt: string;
  lastModifiedBy: ApiClient;
  createdBy: ApiClient;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  addresses: string[];
  shippingAddressIds: string[];
  billingAddressIds: string[];
  isEmailVerified: boolean;
  stores: string[];
  authenticationMode: string;
};

type ApiClient = {
  clientID: string;
  isPlatformClient: boolean;
};
