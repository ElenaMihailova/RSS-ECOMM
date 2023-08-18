import { Address, StoreKeyReference } from '@commercetools/platform-sdk';

export type RouteAction = {
  path: string;
  callback: () => void;
};

export type UserRequest = {
  path: string;
  resource?: string;
};

export interface CustomersFromApi {
  readonly count?: number;
  readonly limit?: number;
  readonly offset?: number;
  readonly esults?: CustomersResults[];
  readonly total?: number;
}

type CustomersResults = {
  readonly id: string;
  readonly version: number;
  readonly createdAt: string;
  readonly lastModifiedAt: string;
  readonly lastModifiedBy?: ApiClient;
  readonly createdBy?: ApiClient;
  readonly email: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly password?: string;
  readonly addresses?: ApiAddress[];
  readonly shippingAddressIds?: string[];
  readonly billingAddressIds?: string[];
  readonly isEmailVerified: boolean;
  readonly stores?: ApiStore[];
  readonly authenticationMode: string;
};

interface ApiAddress {
  readonly id?: string;
  readonly key?: string;
  readonly country: string;
  readonly title?: string;
  readonly salutation?: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly streetName?: string;
  readonly streetNumber?: string;
  readonly additionalStreetInfo?: string;
  readonly postalCode?: string;
  readonly city?: string;
  readonly region?: string;
  readonly state?: string;
  readonly company?: string;
  readonly department?: string;
  readonly building?: string;
  readonly apartment?: string;
  readonly pOBox?: string;
  readonly phone?: string;
  readonly mobile?: string;
  readonly email?: string;
  readonly fax?: string;
  readonly additionalAddressInfo?: string;
  readonly externalId?: string;
}

interface ApiStore {
  readonly typeId: 'store';
  readonly key: string;
}

interface ApiClient {
  readonly clientId?: string;
  readonly isPlatformClient?: boolean;
}

export interface HTMLElementTagNameMap {
  div: HTMLDivElement;
  button: HTMLButtonElement;
  h1: HTMLHeadingElement;
  span: HTMLSpanElement;
  p: HTMLParagraphElement;
  input: HTMLInputElement;
  img: HTMLImageElement;
  table: HTMLTableElement;
  tr: HTMLTableRowElement;
  th: HTMLTableCellElement;
  td: HTMLTableCellElement;
  a: HTMLAnchorElement;
}

export interface AttrSet {
  [key: string]: string;
}
