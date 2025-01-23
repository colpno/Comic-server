import axios from 'axios';
import { RequestHandler } from 'express';

type HealthStatus = 'ok' | 'maintenance';
type HealthCheck = RequestHandler<{}, { status: HealthStatus }, null>;

export const healthCheck: HealthCheck = async (_req, res) => {
  try {
    const response = await axios.get('https://api.mangadex.org/ping');

    if (response.status === 200 && response.data === 'pong') {
      res.json({ status: 'ok' });
    } else {
      res.json({ status: 'maintenance' });
    }
  } catch (error) {
    res.json({ status: 'maintenance' });
  }
};
