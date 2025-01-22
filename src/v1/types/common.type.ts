export type PrimitiveType = string | number | boolean;

/** Retrieve all values of a type. */
export type ValueOf<T> = T[keyof T];

export interface MongoDocFields {
  _id: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}
export type MongoDoc<T> = MongoDocFields & Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

export interface JWTPayload extends Record<string, unknown> {
  userId: string;
}
