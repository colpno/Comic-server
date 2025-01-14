import { RequestHandler } from 'express';

import { BASE_ENDPOINT, PAGINATION_PAGE, PAGINATION_PER_PAGE } from '../constants/common.constant';
import { comicService } from '../services';
import { GetRequestArgs, SuccessfulResponse } from '../types/api.type';
import { Comic } from '../types/comic.type';
import { MangaListQuery, ResponseManga } from '../types/mangadex.type';
import { calculateOffset, toMangaDexEmbedValue } from '../utils/mangadex.util';
import { generatePaginationMeta } from '../utils/meta.util';
import { getMangaById, getMangaList } from './mangadex.controller';

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
    const { _limit = PAGINATION_PER_PAGE, _page = PAGINATION_PAGE, ...query } = req.query;

    const { data: comics, meta } = await comicService.getComicList({
      ...query,
      _limit,
      _page,
    });

    const result: SuccessfulResponse<Comic[]> = {
      data: comics,
      metadata: {
        pagination: generatePaginationMeta({
          page: _page,
          perPage: _limit,
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

type GetComicByIdQuery = {
  /**
   * Available values: cover_art, manga, author, artist, tag
   */
  _embed?: MangaRelationship | MangaRelationship[];
};
export type GetComicById = RequestHandler<
  { id: string },
  SuccessfulResponse<Comic>,
  {},
  GetComicByIdQuery
>;

export const getComicById: GetComicById = async (req, res, next) => {
  try {
    const { id: mangaId } = req.params;
    const { _embed } = req.query;

    const comic = await getMangaById(mangaId, { includes: toMangaDexEmbedValue(_embed) });

    return res.json({ data: comic });
  } catch (error) {
    next(error);
  }
};

type SearchComicsQuery = Pick<GetComicsQuery, '_limit' | '_page' | '_sort' | '_embed'> & {
  q: string;
};
export type SearchComics = RequestHandler<{}, SuccessfulResponse<Comic[]>, null, SearchComicsQuery>;

export const searchComics: SearchComics = async (req, res, next) => {
  try {
    const { _limit = PAGINATION_PER_PAGE, _page = PAGINATION_PAGE, _embed, _sort, q } = req.query;

    const { data: comics, meta } = await getMangaList({
      title: q,
      includes: toMangaDexEmbedValue(_embed),
      order: _sort,
      limit: _limit,
      offset: calculateOffset(_limit, _page),
    });

    const result: SuccessfulResponse<Comic[]> = {
      data: comics,
      metadata: {
        pagination: generatePaginationMeta({
          page: _page,
          perPage: _limit,
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
