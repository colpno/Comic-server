import { RequestHandler } from 'express';

import { BASE_ENDPOINT } from '../constants/common.constant';
import { comicService } from '../services';
import { GetRequestArgs, SuccessfulResponse } from '../types/api.type';
import { Comic } from '../types/comic.type';
import { MangaListQuery, ResponseManga } from '../types/mangadex.type';
import { toMangaDexEmbedValue } from '../utils/mangadex.util';
import { generatePaginationMeta } from '../utils/meta.util';
import { getMangaByTitle } from './mangadex.controller';

type MangaRelationship = ResponseManga['relationships'][number]['type'];

type GetComicsQuery = Omit<
  GetRequestArgs & Omit<MangaListQuery, 'limit' | 'offset' | 'order' | 'includes'>,
  '_select' | '_embed'
> & {
  /**
   * Available values: cover_art, manga, author, artist, tag
   */
  _embed?: MangaRelationship | MangaRelationship[];
};
export type GetComics = RequestHandler<{}, SuccessfulResponse<Comic[]>, null, GetComicsQuery>;

export const getComicList: GetComics = async (req, res, next) => {
  try {
    const { _limit, _page, ...query } = req.query;

    const { data: comics, meta } = await comicService.getComicList({
      ...query,
      _limit,
      _page,
    });

    const result: SuccessfulResponse<Comic[]> = {
      data: comics,
      metadata: {
        pagination: generatePaginationMeta({
          page: _page || 1, // default page is 1
          perPage: _limit || 100, // default perPage is 100 based on mangadex
          endpoint: `${BASE_ENDPOINT}/comics`,
          totalItems: meta.totalItems,
          totalPages: meta.totalPages,
        }),
      },
    };

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

type GetComicQuery = {
  /**
   * Available values: cover_art, manga, author, artist, tag
   */
  _embed?: MangaRelationship | MangaRelationship[];
};
export type GetComic = RequestHandler<
  { title: string },
  SuccessfulResponse<Comic | null>,
  {},
  GetComicQuery
>;

export const getComicByTitle: GetComic = async (req, res, next) => {
  try {
    const { title } = req.params;
    const { _embed } = req.query;

    const comic = await getMangaByTitle(title, { includes: toMangaDexEmbedValue(_embed) });

    return res.json({ data: comic });
  } catch (error) {
    next(error);
  }
};
