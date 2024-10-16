export type PrimitiveType = string | number | boolean;

/** Retrieve all values of a type. */
export type ValueOf<T> = T[keyof T];
