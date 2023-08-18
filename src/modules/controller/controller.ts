import obtainAccessToken from '../api/api-client';
import { getElement } from '../helpers/functions';

class Controller {
  constructor() {
    this.loginHandler();
  }

  public loginHandler(): void {
    const loginBtn: HTMLButtonElement = getElement('.login__button');
    loginBtn.addEventListener('click', async () => {
      await obtainAccessToken();
    });
  }
}

export default Controller;
