import { Tspec } from 'tspec';

import { BASE_ENDPOINT } from '../constants/common.constant';
import * as authController from '../controllers/auth.controller';

export type AuthApiSpec = Tspec.DefineApiSpec<{
  basePath: `${typeof BASE_ENDPOINT}/auth`;
  tags: ['Auth'];
  paths: {
    // GET
    '/csrf-token': {
      get: {
        summary: 'Generate CSRF token';
        handler: typeof authController.generateCSRFToken;
      };
    };
    '/logout': {
      get: {
        summary: 'Logout';
        handler: typeof authController.logout;
      };
    };
    '/refresh-token': {
      get: {
        summary: 'Refresh access token';
        handler: typeof authController.refreshAccessToken;
      };
    };

    // POST
    '/login': {
      post: {
        summary: 'Login';
        handler: typeof authController.login;
      };
    };
    '/register': {
      post: {
        summary: 'Register';
        handler: typeof authController.register;
      };
    };

    // PUT
    '/reset-password': {
      put: {
        summary: 'Reset password';
        handler: typeof authController.resetPassword;
      };
    };
  };
}>;
