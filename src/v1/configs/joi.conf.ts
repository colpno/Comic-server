import OriginalJoi from 'joi';
import { escape } from 'lodash';

interface ExtendedStringSchema extends OriginalJoi.StringSchema {
  escapeHTML(): this;
}

interface ExtendedJoi extends Omit<OriginalJoi.Root, 'string'> {
  string(): ExtendedStringSchema;
}

const escapeHTML: OriginalJoi.Extension = {
  type: 'string',
  base: OriginalJoi.string(),
  messages: {
    'string.escapeHTML': '{{#label}} must be a string',
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        if (typeof value !== 'string') {
          return helpers.error('string.escapeHTML');
        }
        return escape(value);
      },
    },
  },
};

export const Joi: ExtendedJoi = OriginalJoi.extend(escapeHTML);
