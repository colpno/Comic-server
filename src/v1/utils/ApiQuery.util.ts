import { ObjectId } from 'bson';
import { isObjectIdOrHexString } from 'mongoose';

import { AllowedQueries } from '../types/api.type';
import { PrimitiveType, ValueOf } from '../types/common.type';
import {
  ClientProvidedMongoDBOperators,
  MongoDBLogicalOperatorsMap,
  MongoDBOperatorsMap,
  MongoDBUnLogicalOperatorsMap,
} from '../types/mongoOperators.type';
import { Error400 } from './error.utils';

type BuildMongoQueryValue =
  | PrimitiveType
  | PrimitiveType[]
  | Partial<ClientProvidedMongoDBOperators>
  | ObjectId
  | ObjectId[];

type BuildMongoQueryLogicalValue = ValueOf<Pick<ClientProvidedMongoDBOperators, '_and' | '_or'>>;

export default class ApiQuery {
  /** @inheritdoc AllowedQueries */
  protected allowedQueries?: AllowedQueries;
  /** The operators that can be used in the client request. */
  protected clientProvidedOperators = [
    'like',
    'eq',
    'ne',
    'exists',
    'gt',
    'gte',
    'lt',
    'lte',
    'size',
    'all',
    'in',
    'nin',
  ];
  /** The operators that can be used in the MongoDB query. */
  protected mongoOperators = [
    '$regex',
    '$eq',
    '$ne',
    '$exists',
    '$gt',
    '$gte',
    '$lt',
    '$lte',
    '$size',
    '$not',
    '$all',
    '$in',
    '$nin',
  ];

  constructor(allowedQueries?: AllowedQueries) {
    this.allowedQueries = allowedQueries;
  }

  protected buildMongoQuery(value: BuildMongoQueryValue, operator?: keyof MongoDBOperatorsMap) {
    if (isObjectIdOrHexString(value)) {
      value = ObjectId.createFromHexString(value as string);
    }
    if (Array.isArray(value) && value.every(isObjectIdOrHexString)) {
      value = (value as string[]).map(ObjectId.createFromHexString);
    }

    switch (operator) {
      case 'like':
        return { $regex: value, $options: 'i' };
      case 'eq':
        return { $eq: value };
      case 'ne':
        return { $ne: value };
      case 'exists':
        return { $exists: value };
      case 'gt':
        return { $gt: value };
      case 'gte':
        return { $gte: value };
      case 'lt':
        return { $lt: value };
      case 'lte':
        return { $lte: value };
      case 'size':
        if (typeof value === 'object' && value) {
          for (const [op, val] of Object.entries(value)) {
            switch (op) {
              case 'ne':
                return { ['$not']: { $size: val } };
              case 'gte':
                return { [`${val - 1}`]: { $exists: true } };
              case 'gt':
                return { [`${val}`]: { $exists: true } };
              case 'lte':
                return { [`${val}`]: { $exists: false } };
              case 'lt':
                return { [`${val - 1}`]: { $exists: false } };
              default:
                throw new Error400(`Unsupported size operator: ${op}`);
            }
          }
        }
        return { $size: value };
      case 'all':
        return { $all: value };
      case 'in':
        return { $in: value };
      case 'nin':
        return { $nin: value };
      case '_or': {
        const conditions = value as BuildMongoQueryLogicalValue;

        return {
          $or: conditions.map((condition) => {
            type Queries = MongoDBLogicalOperatorsMap['_or']['$or'][0];
            const queries: Queries = {};

            for (const [field, operatorsOrString] of Object.entries(condition)) {
              const obj = { [field]: operatorsOrString };
              const transformed = this.translateToMongoQuery(obj);

              Object.assign(queries, transformed);
            }

            return queries;
          }),
        };
      }
      case '_and': {
        const conditions = value as BuildMongoQueryLogicalValue;

        return {
          $and: conditions.map((condition) => {
            type Queries = MongoDBLogicalOperatorsMap['_and']['$and'][0];
            const queries: Queries = {};

            for (const [field, operatorsOrString] of Object.entries(condition)) {
              const obj = { [field]: operatorsOrString };
              const transformed = this.translateToMongoQuery(obj);

              Object.assign(queries, transformed);
            }

            return queries;
          }),
        };
      }
      default:
        return value;
    }
  }

  protected isMongoOperator = (value: Record<string, unknown>): boolean => {
    if (typeof value !== 'object' || value === null) return false;
    return Object.keys(value).some((key) => this.mongoOperators.includes(key));
  };

  public translateToMongoQuery<DataType extends Record<string, unknown>>(
    input: Record<keyof DataType, PrimitiveType | Partial<ClientProvidedMongoDBOperators>>
  ) {
    const translate = (obj: typeof input) => {
      type Result = Record<string, PrimitiveType | Partial<ValueOf<MongoDBOperatorsMap>>>;
      const result: Result = {};

      for (const [objKey, objValue] of Object.entries(obj)) {
        if (this.clientProvidedOperators.includes(objKey)) {
          const k = objKey as keyof MongoDBUnLogicalOperatorsMap;
          Object.assign(result, this.buildMongoQuery(objValue, k));
          continue;
        }

        if (typeof objValue === 'object') {
          const v = objValue as typeof input;
          result[objKey] = translate(v);
          continue;
        }

        result[objKey] = objValue;
      }

      return result as Record<keyof DataType, ValueOf<Result>>;
    };

    const joinKeys = <T extends Record<string, unknown>>(obj: T, prefix = '') => {
      const result: Record<string, unknown> = {};

      for (const objKey in obj) {
        if (obj.hasOwnProperty(objKey)) {
          const objValue = obj[objKey];
          const prefixedKey = prefix ? `${prefix}.${objKey}` : objKey;

          if (
            typeof objValue === 'object' &&
            objValue !== null &&
            !this.isMongoOperator(objValue as typeof result)
          ) {
            const nestedResult = joinKeys(objValue as typeof obj, prefixedKey);
            Object.assign(result, nestedResult);
            continue;
          }

          result[prefixedKey] = objValue;
        }
      }

      return result as T;
    };

    return joinKeys(translate(input));
  }
}
