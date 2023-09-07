import { getElement } from '../helpers/functions';
import setupMenuToggle from '../helpers/setupMenuToggle';

const setupHeaderListeners = (menuButtonId: string, menuId: string): void => {
  setupMenuToggle(menuButtonId, menuId);
};

export default setupHeaderListeners;
