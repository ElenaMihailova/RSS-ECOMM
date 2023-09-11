import { createElement } from '../../helpers/functions';
import delivery from '../../templates/Delivery';
import payment from '../../templates/Payment';

const basket = createElement({
  tagName: 'section',
  classNames: ['cart', 'container'],
});

const deliveryElement = delivery();
const paymentElement = payment();

const basketContentContainer = document.createElement('div');
basketContentContainer.append(basket, paymentElement, deliveryElement);

const basketContent = {
  title: 'Basket',
  content: basketContentContainer,
};

export default basketContent;
