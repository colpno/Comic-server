import axios from 'axios';
import { RequestHandler } from 'express';

import { HTTP_503_SERVER_UNAVAILABLE } from '../../constants/httpCode.constant';

type HealthStatus = 'ok' | 'maintenance';
type HealthCheck = RequestHandler<{}, { status: HealthStatus }, null>;

export const healthCheck: HealthCheck = async (_req, res, next) => {
  try {
    const response = await axios.get('https://api.mangadex.org/ping');

    if (response.status === 200 && response.data === 'pong') {
      res.json({ status: 'ok' });
    } else {
      res.status(HTTP_503_SERVER_UNAVAILABLE).json({ status: 'maintenance' });
    }
  } catch (error) {
    next(error);
  }
};
