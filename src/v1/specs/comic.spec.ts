import { Tspec } from 'tspec';

import { BASE_ENDPOINT } from '../constants/common.constant';
import { getComicById, getComicList, searchComics } from '../controllers/comic.controller';

export type ComicApiSpec = Tspec.DefineApiSpec<{
  basePath: `${typeof BASE_ENDPOINT}/comics`;
  tags: ['Comic'];
  paths: {
    '/': {
      get: {
        summary: 'Get a list of comics';
        handler: typeof getComicList;
      };
    };
    '/{id}': {
      get: {
        summary: 'Get a comic by id';
        handler: typeof getComicById;
      };
    };
    '/{id}/chapters': {
      get: {
        summary: 'Get a list of chapters of a specific comic';
        handler: typeof getComicById;
      };
    };
    '/search': {
      get: {
        summary: 'Search for comics';
        handler: typeof searchComics;
      };
    };
  };
}>;
