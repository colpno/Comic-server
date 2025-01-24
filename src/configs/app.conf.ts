import { config } from 'dotenv';

import { BASE_ENDPOINT } from '../v1/constants/common.constant';

config();

export const HOST = process.env.HOST || 'localhost';
export const PORT = process.env.PORT || 3000;
export const HOST_URL = process.env.HOST_URL
  ? `${process.env.HOST_URL}${BASE_ENDPOINT}`
  : `http://${HOST}:${PORT}${BASE_ENDPOINT}`;
