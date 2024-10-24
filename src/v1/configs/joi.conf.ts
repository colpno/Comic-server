import OriginalJoi from 'joi';
import { escape } from 'lodash';
import { isObjectIdOrHexString } from 'mongoose';

interface ExtendedStringSchema extends OriginalJoi.StringSchema {
  escapeHTML(): this;
  isMongoObjectId(): this;
}

interface ExtendedObjectSchema extends OriginalJoi.ObjectSchema {
  maxDepth(depth: number): OriginalJoi.ObjectSchema;
}

interface ExtendedJoi extends Omit<OriginalJoi.Root, 'string'> {
  string(): ExtendedStringSchema;
  object: <TSchema = any, isStrict = false, T = TSchema>(
    schema?: OriginalJoi.SchemaMap<T, isStrict>
  ) => ExtendedObjectSchema;
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

const isMongoObjectId: OriginalJoi.Extension = {
  type: 'string',
  base: OriginalJoi.string(),
  messages: {
    'string.isMongoObjectId': '{{#label}} must be a mongo object id',
  },
  rules: {
    isMongoObjectId: {
      validate(value, helpers) {
        if (!isObjectIdOrHexString(value)) {
          return helpers.error('string.isMongoObjectId');
        }
        return value;
      },
    },
  },
};
const maxDepth: OriginalJoi.Extension = {
  type: 'object',
  base: OriginalJoi.object(),
  messages: {
    'object.maxDepth': '{{#label}} depth should not exceed {{#depth}} levels',
  },
  rules: {
    maxDepth: {
      method(depth: number) {
        return this.$_addRule({ name: 'maxDepth', args: { depth } });
      },
      args: [
        {
          name: 'depth',
          ref: true,
          assert: (value: any) => typeof value === 'number' && !isNaN(value),
          message: 'must be a number',
        },
      ],
      validate(value: unknown, helpers: OriginalJoi.CustomHelpers, args: { depth: number }) {
        const calculateDepth = (obj: unknown, currentDepth: number = 0): number => {
          if (typeof obj !== 'object' || obj === null) {
            return currentDepth;
          }
          const depths = Object.values(obj).map((val) => calculateDepth(val, currentDepth + 1));
          return Math.max(currentDepth, ...depths);
        };

        const objectDepth = calculateDepth(value);

        if (objectDepth > args.depth) {
          return helpers.error('object.maxDepth', { depth: args.depth });
        }

        return value;
      },
    },
  },
};

export const Joi: ExtendedJoi = OriginalJoi.extend(escapeHTML, isMongoObjectId, maxDepth);
