import { Tspec } from 'tspec';

import { BASE_ENDPOINT } from '../constants/common.constant';
import { userController } from '../controllers';
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
    '/password/reset': {
      put: {
        summary: 'Reset password for logged in user';
        handler: typeof authController.resetPassword;
      };
    };
    '/password/forgot': {
      put: {
        summary: 'Reset password for users who forgot their password';
        handler: typeof authController.resetPassword;
      };
    };
    '/user': {
      put: {
        summary: 'Update user profile';
        handler: typeof userController.updateUser;
      };
    };
  };
}>;
