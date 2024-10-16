import express from 'express';

import { BASE_ENDPOINT } from './configs/common.conf';
import MongoDB from './databases/MongoDB.database';
import { cors, errorHandler } from './middlewares';
import router from './routes';

const app = express();
const mongoDB = new MongoDB();

app.use(express.static('public'));
app.use(express.json());
app.use(cors);

mongoDB
  .connect()
  .then(() => console.log('Connected to database'))
  .catch((error) => console.error('Failed to connect to database: ', error));

app.use(`${BASE_ENDPOINT}/v1`, router);
app.use(errorHandler);

export { mongoDB };

export default app;
