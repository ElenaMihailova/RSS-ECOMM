import basket from './basket';
import delivery from '../../templates/Delivery';
import payment from '../../templates/Payment';
import { MainData } from '../../../types/interfaces';

const getBasketContent = async (): Promise<MainData> => {
  const basketElement = await basket();
  const itemsContainer = document.createElement('section');
  itemsContainer.classList.add('cart');
  itemsContainer.append(basketElement);

  const deliveryElement = delivery();
  const paymentElement = payment();

  const basketContentContainer = document.createElement('div');
  basketContentContainer.append(itemsContainer, paymentElement, deliveryElement);

  const basketContent = {
    title: 'Basket',
    content: basketContentContainer,
  };

  return basketContent;
};

export default getBasketContent;
