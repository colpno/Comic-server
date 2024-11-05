import { Tspec } from 'tspec';

import { BASE_ENDPOINT } from '../constants/common.constant';
import * as authController from '../controllers/auth.controller';

export type AuthApiSpec = Tspec.DefineApiSpec<{
  basePath: `${typeof BASE_ENDPOINT}/auth`;
  tags: ['Auth'];
  paths: {
    '/csrf-token': {
      get: {
        summary: 'Generate CSRF token';
        handler: typeof authController.generateCSRFToken;
      };
    };
    '/login': {
      post: {
        summary: 'Login';
        handler: typeof authController.login;
      };
    };
    '/logout': {
      get: {
        summary: 'Logout';
        handler: typeof authController.login;
      };
    };
    '/refresh-token': {
      get: {
        summary: 'Refresh access token';
        handler: typeof authController.refreshAccessToken;
      };
    };
  };
}>;
