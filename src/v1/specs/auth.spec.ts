import { Tspec } from 'tspec';

import { BASE_ENDPOINT } from '../configs/common.conf';
import { generateCSRFToken } from '../controllers/auth.controller';

export type AuthApiSpec = Tspec.DefineApiSpec<{
  basePath: `${typeof BASE_ENDPOINT}/auth`;
  tags: ['Auth'];
  paths: {
    '/csrf-token': {
      get: {
        summary: 'Generate CSRF token';
        handler: typeof generateCSRFToken;
      };
    };
  };
}>;
