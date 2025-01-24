import { NextFunction, Request, Response } from 'express';
import { Schema } from 'joi';

import { HTTP_400_BAD_REQUEST } from '../../constants/httpCode.constant';
import { Joi } from '../configs/joi.conf';
import { Proxy } from '../controllers/nonResources.controller';
import { processValidationError } from '../utils/validation.util';
import { validationOptions } from './';

type ProxySchema = Record<keyof Parameters<Proxy>[0]['params'], Schema>;

export const proxy = (req: Request, res: Response, next: NextFunction) => {
  const reqParams: Parameters<Proxy>[0]['params'] = {
    proxyUrl: `${req.params.proxyUrl}${req.params[0]}`,
  };

  const schema = Joi.object<ProxySchema>({
    proxyUrl: Joi.string().uri().required(),
  });

  const { error, value } = schema.validate(reqParams, validationOptions);

  if (error) {
    return res.status(HTTP_400_BAD_REQUEST).json(processValidationError(error));
  }

  req.originalParams = reqParams;
  req.params = value;

  next();
};
