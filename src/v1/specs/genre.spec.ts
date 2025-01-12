import { Tspec } from 'tspec';

import { BASE_ENDPOINT } from '../constants/common.constant';
import { getGenreList } from '../controllers/genre.controller';

export type GenreApiSpec = Tspec.DefineApiSpec<{
  basePath: `${typeof BASE_ENDPOINT}/genres`;
  tags: ['Genre'];
  paths: {
    '/': {
      get: {
        summary: 'Get a list of genres';
        handler: typeof getGenreList;
      };
    };
  };
}>;
