import express from 'express';

import v1App from './v1';

const app = express();

app.use(express.static('public'));
app.use(express.json());

app.use(v1App);

export default app;
