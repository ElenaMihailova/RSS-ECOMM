import './index.scss';

import getEndpoint from './modules/api/api-client';
import App from './modules/app/app';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const app = new App();

console.log(getEndpoint());
