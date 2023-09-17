import basket from './basket';
import delivery from '../../templates/Delivery';
import payment from '../../templates/Payment';
import { getActiveCart } from '../../api';
import ApiClientBuilder from '../../api/buildRoot';

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

export default basketContent;
