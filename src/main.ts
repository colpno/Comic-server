import { PORT } from './configs/app.conf';
import app from './v1';

/* Server listening */
app.listen(PORT, () => {
  console.log(`Express server is running on http://localhost:${PORT}.`);
});
