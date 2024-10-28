export type PrimitiveType = string | number | boolean;
export interface MongoDocFields {
  _id: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

/** Retrieve all values of a type. */
export type ValueOf<T> = T[keyof T];
