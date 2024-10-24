import { Request } from 'express';

import { ErrorResponseMetadata, PaginationMeta } from '../types/api.type';

type GeneratePaginationMetaArgs = {
  page: PaginationMeta['currentPage'];
  perPage: PaginationMeta['perPage'];
  /** An endpoint for navigating pagination. */
  endpoint: string;
  totalItems: PaginationMeta['totalItems'];
  totalPages: PaginationMeta['totalPages'];
};

export const generatePaginationMeta = ({
  page,
  perPage,
  endpoint,
  totalItems,
  totalPages,
}: GeneratePaginationMetaArgs): PaginationMeta => ({
  currentPage: page,
  links: {
    next: page < totalPages ? `${endpoint}?_limit=${perPage}&_page=${page + 1}` : undefined,
    previous: page > 0 ? `${endpoint}?_limit=${perPage}&_page=${page - 1}` : undefined,
  },
  perPage: perPage,
  totalItems,
  totalPages,
});

export const generateErrorMetadata = (
  req: Request,
  overide?: Partial<ErrorResponseMetadata>
): ErrorResponseMetadata => ({
  requestId: req.headers['x-request-id'] as string,
  timestamp: new Date().toISOString(),
  endpoint: req.url,
  httpMethod: req.method,
  stackTrace: '',
  errorName: '',
  environment: process.env.NODE_ENV as string,
  ...overide,
});
