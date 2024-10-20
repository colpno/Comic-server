import { PrimitiveType, ValueOf } from './common.type';

export interface ClientProvidedMongoDBOperators {
  /** Contain string. */
  like: string;
  /** Equal. */
  eq: PrimitiveType;
  /** Not equal. */
  ne: PrimitiveType;
  /** Not null or the field is exist. */
  exists: boolean;
  /** Greater than. */
  gt: Exclude<PrimitiveType, boolean>;
  /** Greater than or equal. */
  gte: Exclude<PrimitiveType, boolean>;
  /** Lesser than. */
  lt: Exclude<PrimitiveType, boolean>;
  /** Lesser than or equal. */
  lte: Exclude<PrimitiveType, boolean>;
  /** Compare array size. */
  size:
    | number
    | { ne: number }
    | { gte: number }
    | { gt: number }
    | { lte: number }
    | { lt: number };
  /** Has all values. */
  all: PrimitiveType[];
  /** Has one of the values. */
  in: PrimitiveType[];
  /** Has no value in. */
  nin: PrimitiveType[];
  /** This or that. */
  or: Record<
    string,
    Pick<
      ClientProvidedMongoDBOperators,
      'like' | 'eq' | 'ne' | 'exists' | 'gt' | 'gte' | 'lt' | 'lte' | 'size' | 'all' | 'in' | 'nin'
    >
  >[];
  /** This and that. */
  and: ClientProvidedMongoDBOperators['or'];
}

export interface MongoDBUnLogicalOperatorsMap {
  like: { $regex: string; $options: 'i' };
  eq: PrimitiveType;
  ne: { $ne: PrimitiveType };
  exists: { $exists: boolean };
  gt: { $gt: Exclude<PrimitiveType, boolean> };
  gte: { $gte: Exclude<PrimitiveType, boolean> };
  lt: { $lt: Exclude<PrimitiveType, boolean> };
  lte: { $lte: Exclude<PrimitiveType, boolean> };
  size: { $size: number } | { $not: { $size: number } } | { $exists: boolean };
  all: { $all: Exclude<PrimitiveType, boolean>[] };
  in: { $in: Exclude<PrimitiveType, boolean>[] };
  nin: { $nin: Exclude<PrimitiveType, boolean>[] };
}

export interface MongoDBLogicalOperatorsMap {
  or: { $or: Record<string, ValueOf<MongoDBUnLogicalOperatorsMap> | PrimitiveType>[] };
  and: { $and: Record<string, ValueOf<MongoDBUnLogicalOperatorsMap> | PrimitiveType>[] };
}

export type MongoDBOperatorsMap = MongoDBLogicalOperatorsMap & MongoDBUnLogicalOperatorsMap;
