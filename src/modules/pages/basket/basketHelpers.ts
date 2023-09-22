import { Cart, LineItem } from '@commercetools/platform-sdk';
import { calculateTotalAmount, convertCentsToEuros, getElement, getEuroCurrencyString } from '../../helpers/functions';
import getBasketContent from './basketContent';
import { emptyBasket } from './basket';

export const setBasketEmptyState = (): void => {
  const cartItems: HTMLDivElement = getElement('.cart__items');
  cartItems.innerHTML = '';
  const emptyBasketItems = emptyBasket();
  cartItems.append(emptyBasketItems);
};

export const rerenderBasketData = async (): Promise<void> => {
  const basketData = await getBasketContent();
  const cartItems: HTMLDivElement = getElement('.cart__items');
  cartItems.innerHTML = '';
  cartItems.append(basketData.content);
};

export const deliveryAmount = 300;

export const renderItemSumAmount = (cart: Cart, basketItem: HTMLElement, productID: string | undefined): void => {
  const itemSum = basketItem.querySelector('.buying__sum') as HTMLParagraphElement;

  const product = cart.lineItems.find((lineItem) => lineItem.id === productID);
  if (!product) {
    return;
  }

  const itemSumValue = getEuroCurrencyString(convertCentsToEuros(product.totalPrice.centAmount));
  itemSum.textContent = itemSumValue;
};

export const renderCartSumAmount = (cart: Cart): void => {
  const cartSumAmount: HTMLParagraphElement = getElement('.cart__items .sum__amount');
  const cartSumSubtotal: HTMLParagraphElement = getElement('.subtotal__amount');
  const cartSumTotal: HTMLParagraphElement = getElement('.total__amount');

  const subtotalAmount = cart.totalPrice.centAmount;
  const subtotalAmountValue = getEuroCurrencyString(convertCentsToEuros(subtotalAmount));
  cartSumAmount.textContent = subtotalAmountValue;
  cartSumSubtotal.textContent = subtotalAmountValue;

  const totalAmount = calculateTotalAmount(subtotalAmount, deliveryAmount);
  cartSumTotal.textContent = getEuroCurrencyString(convertCentsToEuros(totalAmount));
};

export const renderDeliveryAmount = (): void => {
  const delivery: HTMLParagraphElement = getElement('.delivery__amount');
  delivery.textContent = getEuroCurrencyString(convertCentsToEuros(deliveryAmount));
};

export const getProductFromCart = (cart: Cart, cartItemID: string | undefined): LineItem | null => {
  const product = cart.lineItems.find((item) => item.id === cartItemID);
  if (!product) {
    return null;
  }
  return product;
};
