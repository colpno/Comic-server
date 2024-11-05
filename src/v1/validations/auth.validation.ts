import { RequestHandler } from 'express';
import { Schema, ValidationOptions } from 'joi';

import { Joi } from '../configs/joi.conf';
import { Login } from '../controllers/auth.controller';
import { processValidationError } from '../utils/validation.util';

type LoginSchema = Record<keyof Parameters<Login>['0']['body'], Schema>;

export const login: RequestHandler = (req, res, next) => {
  const options: ValidationOptions = {
    stripUnknown: true,
  };

  const scheme = Joi.object<LoginSchema>({
    email: Joi.string().email().required(),
    password: Joi.string().min(16).required(),
    forgetMe: Joi.boolean().required(),
  });

  const { error, value } = scheme.validate(req.body, options);

  if (error) {
    return res.status(400).json(processValidationError(error));
  }

  req.originalBody = req.body;
  req.body = value;

  next();
};
