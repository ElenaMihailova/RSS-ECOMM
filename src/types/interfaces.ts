import { QueryParam } from '@commercetools/sdk-client-v2';

import { Attribute } from '@commercetools/platform-sdk';

export interface AttrSet {
  [key: string]: string;
}

export interface ElementData {
  tagName: keyof HTMLElementTagNameMap;
  classNames?: string[];
  attributes?: AttrSet[];
  text?: string;
  html?: string;
  parent?: HTMLElement;
}

export interface FormItems {
  tagName: keyof HTMLElementTagNameMap;
  attributes?: AttrSet[];
  classNames?: string[];
  options?: SelectOption[];
  icon?: Icon;
  btn?: InputBtn;
}

export interface ProfileData {
  id?: string;
  title?: string;
  buttonEdit?: string;
  buttonRemove?: string;
  buttonSave?: string;
  addressDetails?: AddressDetails;
  dataItems?: ProfileDataItem[];
}

export interface AddressDetails {
  shippingAddress: boolean;
  billingAddress: boolean;
  isDefaultShippingAddress: boolean;
  isDefaultBillingAddress: boolean;
}

export interface ProfileDataItem {
  label: string;
  element: FormItems;
}

export interface SelectOption {
  text: string;
  attributes?: AttrSet[];
}

export interface Icon {
  containerClassName: string;
  attributes?: AttrSet[];
  className: string;
  id: string;
}

export interface InputBtn {
  className: string;
  attributes?: AttrSet[];
  text: string;
}

export interface Data {
  [key: string]: string;
}

export interface FormAddressData {
  data?: BaseAddress;
  category?: string;
  isDefault?: boolean;
  additionalCategory?: string;
}

export interface BaseAddress {
  id?: string;
  key?: string;
  country: string;
  streetName?: string;
  postalCode?: string;
  city?: string;
}

export interface CustomerData {
  id?: string;
  key?: string;
  customerNumber?: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  version?: number;
  dateOfBirth?: string;
  addresses?: BaseAddress[];
  defaultShippingAddress?: number;
  shippingAddresses?: number[];
  defaultBillingAddress?: number;
  billingAddresses?: number[];
}

export interface QueryArgs {
  filter?: string[];
  sort?: string[];
  ['text.en-US']?: string;
  [key: string]: QueryParam;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  newPasswordRepeat: string;
}

export interface MainData {
  title: string;
  content: string | HTMLDivElement;
}

export interface ProductData {
  link: string;
  title: string;
  price: number;
  discount?: number;
  categories?: string[];
  imageURLs: string[];
  description: string;
  details?: Attribute[];
}

export interface CartProduct {
  name: string;
  centAmount: number;
  slug: string;
  taxCategoryID: string;
}
