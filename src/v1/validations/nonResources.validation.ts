import { NextFunction, Request, Response } from 'express';
import { Schema } from 'joi';

import { HTTP_400_BAD_REQUEST } from '../../constants/httpCode.constant';
import { Joi } from '../configs/joi.conf';
import { Proxy } from '../controllers/nonResources.controller';
import { processValidationError } from '../utils/validation.util';
import { validationOptions } from './';

type ProxySchema = Record<keyof Parameters<Proxy>[0]['params'], Schema>;

export const proxy = (req: Request, res: Response, next: NextFunction) => {
  req.params.proxyUrl = decodeURIComponent(req.params.proxyUrl);

  const schema = Joi.object<ProxySchema>({
    proxyUrl: Joi.string().uri().required(),
  });

  const { error, value } = schema.validate(req.params, validationOptions);

  if (error) {
    return res.status(HTTP_400_BAD_REQUEST).json(processValidationError(error));
  }

  req.originalParams = req.params;
  req.params = value;

  next();
};
