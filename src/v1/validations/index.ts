import Joi from 'joi';

export * as authValidator from './auth.validation';
export * as chapterValidator from './chapter.validation';
export * as comicValidator from './comic.validation';
export * as followValidator from './follow.validation';
export * as nonResourcesValidator from './nonResources.validation';

export const validationOptions: Joi.ValidationOptions = {
  stripUnknown: true,
};
