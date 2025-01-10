import { RequestHandler } from 'express';
import { Schema, ValidationOptions } from 'joi';

import { Joi } from '../configs/joi.conf';
import { Login, Register, ResetPassword } from '../controllers/auth.controller';
import { processValidationError } from '../utils/validation.util';

type LoginSchema = Record<keyof Parameters<Login>['0']['body'], Schema>;

export const login: RequestHandler = (req, res, next) => {
  const options: ValidationOptions = {
    stripUnknown: true,
  };

  const scheme = Joi.object<LoginSchema>({
    email: Joi.string().email().required(),
    password: Joi.string().min(16).required(),
    rememberMe: Joi.boolean().optional(),
  });

  const { error, value } = scheme.validate(req.body, options);

  if (error) {
    return res.status(400).json(processValidationError(error));
  }

  req.originalBody = req.body;
  req.body = value;

  next();
};

type RegisterSchema = Record<keyof Parameters<Register>['0']['body'], Schema>;

export const register: RequestHandler = (req, res, next) => {
  const options: ValidationOptions = {
    stripUnknown: true,
  };

  const scheme = Joi.object<RegisterSchema>({
    email: Joi.string().email().required(),
    password: Joi.string().min(16).required(),
    passwordVerification: Joi.string().valid(Joi.ref('password')).required(),
  });

  const { error, value } = scheme.validate(req.body, options);

  if (error) {
    return res.status(400).json(processValidationError(error));
  }

  req.originalBody = req.body;
  req.body = value;

  next();
};

type ResetPasswordSchema = Record<keyof Parameters<ResetPassword>['0']['body'], Schema>;

export const resetPassword: RequestHandler = (req, res, next) => {
  const options: ValidationOptions = {
    stripUnknown: true,
  };

  const scheme = Joi.object<ResetPasswordSchema>({
    email: Joi.string().email().required(),
    password: Joi.string().min(16).required(),
    passwordVerification: Joi.string().valid(Joi.ref('password')).required(),
  });

  const { error, value } = scheme.validate(req.body, options);

  if (error) {
    return res.status(400).json(processValidationError(error));
  }

  req.originalBody = req.body;
  req.body = value;

  next();
};
