import './index.scss';

import getEndpoint from './modules/api/api-client';
import App from './modules/app/app';

const app = new App();

console.log(getEndpoint());

