import { RequestHandler } from 'express';
import requestIp from 'request-ip';

const retrieveClientIP: RequestHandler = function (req, _res, next) {
  const clientIp = requestIp.getClientIp(req);
  req.clientIP = clientIp;
  next();
};

export default retrieveClientIP;
