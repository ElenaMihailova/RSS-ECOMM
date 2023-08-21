import './index.scss';

import getEndpoint from './modules/api/api-client';
import App from './modules/app/app';
import './index.scss';

const app = new App();

console.log(getEndpoint());
