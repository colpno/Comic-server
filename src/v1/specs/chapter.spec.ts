import { Tspec } from 'tspec';

import { BASE_ENDPOINT } from '../constants/common.constant';
import { getChapterContent } from '../controllers/chapter.controller';

export type ChapterApiSpec = Tspec.DefineApiSpec<{
  basePath: `${typeof BASE_ENDPOINT}/chapters`;
  tags: ['Chapter'];
  paths: {
    '/{id}/content': {
      get: {
        summary: 'Get content of a specific chapter';
        handler: typeof getChapterContent;
      };
    };
  };
}>;
