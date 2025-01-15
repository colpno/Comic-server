import app from './app';
import { PORT } from './configs/app.conf';
import { MongoDB } from './databases/MongoDB.database';

console.log('Connecting to database...');

new MongoDB()
  .connect()
  .then(() => {
    console.log('Connected to database');

    app.listen(PORT, () => {
      console.log(`Express server is running on http://localhost:${PORT}.`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to database: ', error);
    process.exit(1);
  });
