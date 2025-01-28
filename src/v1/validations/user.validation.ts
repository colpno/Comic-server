import { RequestHandler } from 'express';
import { Schema } from 'joi';

import { Joi } from '../configs/joi.conf';
import { UpdateUser } from '../controllers/user.controller';
import { processValidationError } from '../utils/validation.util';
import { validationOptions } from './';

type UpdateUserSchema = Record<keyof Parameters<UpdateUser>['0']['body'], Schema>;

export const updateUser: RequestHandler = (req, res, next) => {
  const scheme = Joi.object<UpdateUserSchema>({
    email: Joi.string().email(),
    password: Joi.string().min(12),
    passwordVerification: Joi.string().valid(Joi.ref('password')),
  });

  const { error, value } = scheme.validate(req.body, validationOptions);

  if (error) {
    return res.status(400).json(processValidationError(error));
  }

  req.originalBody = req.body;
  req.body = value;

  next();
};
