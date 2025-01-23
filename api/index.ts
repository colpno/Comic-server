import express from 'express';

import mainApp from '../src/app';
import MongoDB from '../src/databases/MongoDB.database';

new MongoDB()
  .connect()
  .then(() => {
    console.log('Connected to database');
  })
  .catch((error) => {
    console.error('Failed to connect to database: ', error);
    process.exit(1);
  });

// Put the following code outside promise handler to make sure that vercel will recognize the app.
// Or else, nothing will be executed. For more specific
// E.g. Put `app.use(mainApp)` inside the `then` block, then routes, middlewares, etc. will never be accessible.
const app = express();

app.use(mainApp);

export default app;
