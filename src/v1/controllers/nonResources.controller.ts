import axios from 'axios';
import { RequestHandler } from 'express';

import { corsProxy } from '../services';

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

export type Proxy = RequestHandler<{ proxyUrl: string }, void, null>;

export const proxy: Proxy = async (req, res) => {
  req.url = decodeURIComponent(req.url).replace('/proxy/', '/'); // Strip '/proxy' from the front of the URL, else the proxy won't work.
  req.headers['referer'] = ''; // Set the referer header to empty value to bypass the Mangadex API's CORS.

  corsProxy.emit('request', req, res);
};
