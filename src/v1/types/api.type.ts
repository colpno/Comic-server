import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { Document, Model, RootQuerySelector } from 'mongoose';

import { PrimitiveType } from './common.type';
import { ClientProvidedMongoDBOperators, MongoDBOperatorsMap } from './mongoOperators.type';

/* 
======================================================================
 
  Response types for API
 
======================================================================
*/

export interface PaginationMeta {
  /** The current page. */
  currentPage: number;
  /** The links to navigate pages. */
  links: {
    /**
     * The link to the next page.
     */
    next?: string;
    /**
     * The link to the previous page.
     */
    previous?: string;
  };
  /** The maximum items in 1 page. */
  perPage: number;
  /** The total of items. */
  totalItems: number;
  /** The total of pages. */
  totalPages: number;
}

export interface SuccessfulResponse<D = unknown> {
  data: D;
  metadata?: {
    pagination?: PaginationMeta;
  };
}

export interface ErrorResponseMetadata {
  requestId: string;
  /**
   * The timestamp the error occurred.
   * @type {string} - ISO format.
   * @
   */
  timestamp: string;
  /**
   * The request endpoint.
   */
  endpoint: ExpressRequest['originalUrl'];
  httpMethod: ExpressRequest['method'];
  stackTrace: string;
  errorName: string;
  environment: string;
}

export interface ValidationError {
  path: string;
  message: string;
}

export interface FailedResponse {
  /** HTTP status code. */
  code: number;
  /** Indicate the request as error or not. */
  error: boolean;
  reason: string | ValidationError[];
  /** Only available on a **non-production** environment. */
  metadata?: ErrorResponseMetadata;
}

export type ResponseContent = SuccessfulResponse | FailedResponse;

export type Response = ExpressResponse<ResponseContent>;

/* 
======================================================================
 
  Request types for API.
 
======================================================================
*/

/**
 * The allowed queries for the request.
 * @example
 * { field1: ['eq', 'gt'], field2: ['eq', 'gt'] }
 */
export type AllowedQueries = Record<string, (keyof MongoDBOperatorsMap)[]>;

export type Embed<DataType = Record<string, unknown>> = {
  /**
   * The field which will be populated.
   * @example
   * 'field'
   */
  path: string;
  /**
   * Choose the fields to return or not. By define the field with or without the prefix minus sign "-".
   * @example
   * 'field1 field2 -field3'
   */
  select?: string;
  /**
   * The filter of the populated doc.
   * @example
   * { field1: 'value1', field2: { gt: 10 } }
   */
  match?: Partial<Record<keyof DataType, Partial<ClientProvidedMongoDBOperators>>>;
  /**
   * For deep population. Repeat the embed object.
   */
  populate?: GetRequestArgs<DataType>['_embed'];
};

export type SortOrder = 'asc' | 'desc';

/**
 * @example
 * { field1: 'asc', field2: 'desc' }
 */
export type Sort<DataType = Record<string, unknown>> = Partial<Record<keyof DataType, SortOrder>>;

/**
 * The filter for the query.
 * @example
 * { field1: 'value1', field2: { gt: 10 } }
 */
export type Filter<DataType = Record<string, unknown>> = Partial<
  Record<keyof DataType, PrimitiveType | Partial<ClientProvidedMongoDBOperators>>
>;

export type GetRequestArgs<
  DataType = undefined,
  MongooseModel extends Model<Document> | undefined = undefined
> = (DataType extends undefined ? {} : Filter<DataType>) &
  (MongooseModel extends Model<Document> ? RootQuerySelector<MongooseModel> : {}) & {
    /**
     * Choose the fields to return or not. By define the field with or without the prefix minus sign "-".
     * @example
     * 'field1 field2 -field3'
     */
    _select?: string;
    /**
     * Embed the related collection in the result.
     * @example
     * 'field'
     * @example
     * { path: 'field' }
     * @example
     * [{ path: 'field' }]
     */
    _embed?: string | Embed<DataType> | Embed<DataType>[];
    /**
     * Sort column(s).
     * @example
     * { field1: 'asc', field2: 'desc' }
     */
    _sort?: Sort<DataType>;
    /** Limit the number of items per page. */
    _limit?: number;
    /** For paginating. */
    _page?: number;
  };
