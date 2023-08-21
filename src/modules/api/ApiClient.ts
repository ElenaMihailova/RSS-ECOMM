import { MyCustomerDraft, createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import ctpClient from './BuildClient';
import { BaseAdress, CustomerData, FormAdressData } from '../../types/interfaces';
import { AdressCategories } from '../../types/enums';

// Create apiRoot from the imported ClientBuilder and include your Project key
const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
  projectKey: process.env.CTP_PROJECT_KEY as string,
});

export const addAddress = async (ID: string, version: number, adressData: BaseAdress): Promise<BaseAdress | object> => {
  try {
    const res = await apiRoot
      .customers()
      .withId({ ID })
      .post({
        body: {
          version,
          actions: [
            {
              action: 'addAddress',
              address: adressData,
            },
          ],
        },
      })
      .execute();
    const resData = await res.body.addresses;
    return resData;
  } catch (err) {
    console.error(err);
  }
  return {};
};

export const addDefaultShippingAdressID = async (
  customerId: string,
  addressId: string,
  customerVersion: number,
): Promise<BaseAdress | object> => {
  try {
    const res = await apiRoot
      .customers()
      .withId({ ID: customerId })
      .post({
        body: {
          version: customerVersion,
          actions: [
            {
              action: 'setDefaultShippingAddress',
              addressId,
            },
          ],
        },
      })
      .execute();
    const resData = await res.body;
    return resData;
  } catch (err) {
    console.error(err);
  }
  return {};
};

export const addDefaultBillingAdressID = async (
  customerId: string,
  addressId: string,
  customerVersion: number,
): Promise<BaseAdress | object> => {
  try {
    const res = await apiRoot
      .customers()
      .withId({ ID: customerId })
      .post({
        body: {
          version: customerVersion,
          actions: [
            {
              action: 'setDefaultBillingAddress',
              addressId,
            },
          ],
        },
      })
      .execute();
    const resData = await res.body;
    return resData;
  } catch (err) {
    console.error(err);
  }
  return {};
};

export const addShippingAdressID = async (
  customerId: string,
  addressId: string,
  customerVersion: number,
): Promise<BaseAdress | object> => {
  try {
    const res = await apiRoot
      .customers()
      .withId({ ID: customerId })
      .post({
        body: {
          version: customerVersion,
          actions: [
            {
              action: 'addShippingAddressId',
              addressId,
            },
          ],
        },
      })
      .execute();
    const resData = await res.body;
    return resData;
  } catch (err) {
    console.error(err);
  }
  return {};
};

export const addBillingAdressID = async (
  customerId: string,
  addressId: string,
  customerVersion: number,
): Promise<BaseAdress | object> => {
  try {
    const res = await apiRoot
      .customers()
      .withId({ ID: customerId })
      .post({
        body: {
          version: customerVersion,
          actions: [
            {
              action: 'addBillingAddressId',
              addressId,
            },
          ],
        },
      })
      .execute();
    const resData = await res.body;
    return resData;
  } catch (err) {
    console.error(err);
  }
  return {};
};

export const getCustomerByID = async (ID: string): Promise<BaseAdress | object> => {
  try {
    const res = await apiRoot.customers().withId({ ID }).get().execute();
    const resData = await res.body;
    return resData;
  } catch (err) {
    console.error(err);
  }
  return {};
};

export const createAdress = async (
  customerId: string,
  customerVersion: number,
  adressData: BaseAdress,
): Promise<string | undefined> => {
  const adress = await addAddress(customerId, customerVersion, adressData);
  const data = adress as BaseAdress[];
  const lastAddedAdressID = data[data.length - 1].id;
  return lastAddedAdressID;
};

export const getUpdatedCustomer = async (customerID: string): Promise<MyCustomerDraft> => {
  const updatedCustomersData: MyCustomerDraft | object = await getCustomerByID(customerID);
  const data = updatedCustomersData as MyCustomerDraft;
  return data;
};

export const getUpdatedVersion = async (customerID: string): Promise<number | undefined> => {
  const updatedCustomersData: CustomerData | object = await getCustomerByID(customerID);
  const data = updatedCustomersData as CustomerData;
  const { version } = data;
  if (version) {
    return version;
  }
  return version;
};

export const setDefaultAdress = async (category: string, customerID: string, addressId: string): Promise<void> => {
  const version = await getUpdatedVersion(customerID);
  if (version) {
    if (category === AdressCategories.shipping) {
      await addDefaultShippingAdressID(customerID, addressId, version);
    } else if (category === AdressCategories.billing) {
      await addDefaultBillingAdressID(customerID, addressId, version);
    }
  }
};

export const setAdressIDs = async (category: string, customerID: string, addressId: string): Promise<void> => {
  const version = await getUpdatedVersion(customerID);
  if (version) {
    if (category === AdressCategories.shipping) {
      await addShippingAdressID(customerID, addressId, version);
    } else if (category === AdressCategories.billing) {
      await addBillingAdressID(customerID, addressId, version);
    }
  }
};

export const addNewAdress = async (
  customerID: string,
  adressData: BaseAdress,
  category: string,
  isDefault: boolean,
  additionalCategory?: string,
): Promise<void> => {
  const customerData: CustomerData | object = await getCustomerByID(customerID);
  const data = customerData as CustomerData;
  const { version } = data;
  const { id } = data;
  if (version && id) {
    const addressId = await createAdress(id, version, adressData);
    if (addressId) {
      await setAdressIDs(category, id, addressId);
      if (isDefault) {
        await setDefaultAdress(category, id, addressId);
      }

      if (additionalCategory) {
        await setAdressIDs(additionalCategory, id, addressId);
        if (isDefault) {
          await setDefaultAdress(additionalCategory, id, addressId);
        }
      }
    }
  }
};

export const createCustomer = async (data: MyCustomerDraft): Promise<MyCustomerDraft | object> => {
  try {
    const res = await apiRoot
      .me()
      .signup()
      .post({
        body: data,
      })
      .execute();
    const resData = await res.body.customer;
    return resData;
  } catch (err) {
    console.error(err);
  }
  return {};
};

export const createCustomerWithAdress = async (
  customerData: CustomerData,
  shippingAddress: FormAdressData,
  billingAdress?: FormAdressData,
): Promise<void> => {
  const customersData: CustomerData | object = await createCustomer(customerData);
  const data = customersData as CustomerData;

  const { id } = data;
  if (id) {
    if (!billingAdress) {
      if (shippingAddress.data && shippingAddress.category && shippingAddress.isDefault !== undefined) {
        await addNewAdress(
          id,
          shippingAddress.data,
          shippingAddress.category,
          shippingAddress.isDefault,
          shippingAddress.additionalCategory,
        );
      }
    } else {
      if (shippingAddress.data && shippingAddress.category && shippingAddress.isDefault !== undefined) {
        await addNewAdress(id, shippingAddress.data, shippingAddress.category, shippingAddress.isDefault);
      }
      if (billingAdress.data && billingAdress.category && billingAdress.isDefault !== undefined) {
        await addNewAdress(id, billingAdress.data, billingAdress.category, billingAdress.isDefault);
      }
    }
  }
};
