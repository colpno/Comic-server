import { RequestHandler } from 'express';

import { BASE_ENDPOINT, PAGINATION_PAGE, PAGINATION_PER_PAGE } from '../constants/common.constant';
import { GetRequestArgs, SuccessfulResponse } from '../types/api.type';
import { Comic } from '../types/comic.type';
import { MangaListQuery, ResponseManga } from '../types/mangadex.type';
import { calculateOffset, toMangaDexEmbedValue } from '../utils/mangadex.util';
import { generatePaginationMeta } from '../utils/meta.util';
import { getMangaById, getMangaList, getTagIdList } from './mangadex.controller';

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
    const {
      _limit = PAGINATION_PER_PAGE,
      _page = PAGINATION_PAGE,
      _embed,
      _sort,
      includedTags,
      ...query
    } = req.query;

    const tagIds =
      includedTags && includedTags.length > 0 ? await getTagIdList(includedTags) : undefined;

    const { data: comics, meta } = await getMangaList({
      ...query,
      includedTags: tagIds,
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
