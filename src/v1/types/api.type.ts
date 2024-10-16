import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

/* 
======================================================================
 
  Response types for API
 
======================================================================
*/

export interface Pagination {
  /** The current page. */
  currentPage: number;
  /** The links to navigate pages. */
  links: {
    /**
     * The link to the next page.
     * @example
     * /api/v1/users?page=3
     */
    next: string;
    /**
     * The link to the previous page.
     * @example
     * /api/v1/users?page=1
     */
    previous: string;
  };
  /** The maximum items in 1 page. */
  perPage: number;
  /** The total of items. */
  totalItems: number;
  /** The total of pages. */
  totalPages: number;
}

export interface SuccessfulResponseContent {
  data: unknown[] | Record<string, unknown>;
  metadata?: {
    pagination?: Pagination;
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
   * @example
   * /api/v1/users
   */
  endpoint: ExpressRequest['originalUrl'];
  httpMethod: ExpressRequest['method'];
  stackTrace: string;
  errorName: string;
  environment: string;
}

export interface ErrorResponseContent {
  /** HTTP status code. */
  code: number;
  /** Indicate the request as error or not. */
  error: boolean;
  reason: string;
  /** Only available on a **non-production** environment. */
  metadata?: ErrorResponseMetadata;
}

export type ResponseContent = SuccessfulResponseContent | ErrorResponseContent;

export type Response = ExpressResponse<ResponseContent>;
