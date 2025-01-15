import { Tspec } from 'tspec';

import { BASE_ENDPOINT } from '../constants/common.constant';
import {
  AddFollow,
  getFollow,
  getFollowList,
  removeFollow,
} from '../controllers/follow.controller';

export type FollowApiSpec = Tspec.DefineApiSpec<{
  basePath: `${typeof BASE_ENDPOINT}/follows`;
  tags: ['Follow'];
  paths: {
    '/': {
      get: {
        summary: 'Get a list of follows';
        handler: typeof getFollowList;
      };
      post: {
        summary: 'Add a follow';
        body: Parameters<AddFollow>[0]['body'];
      };
      put: {
        summary: 'Add a follow';
        body: Parameters<AddFollow>[0]['body'];
      };
      delete: {
        summary: 'Remove a follow';
        handler: typeof removeFollow;
      };
    };
  };
  '/:comicId': {
    get: {
      summary: 'Get a follow';
      handler: typeof getFollow;
    };
  };
}>;
