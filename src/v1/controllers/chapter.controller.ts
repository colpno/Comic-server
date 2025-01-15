import { RequestHandler } from 'express';

import { BASE_ENDPOINT } from '../constants/common.constant';
import { GetRequestArgs, Sort, SuccessfulResponse } from '../types/api.type';
import { Chapter } from '../types/chapter.type';
import { MangaFeedQuery } from '../types/mangadex.type';
import { calculateOffset } from '../utils/mangadex.util';
import { generatePaginationMeta } from '../utils/meta.util';
import * as mangadexController from './mangadex.controller';

type GetChaptersByMangaIdQuery = Omit<GetRequestArgs, '_select' | '_embed' | '_sort'> & {
  include?: ('emptyPages' | 'futurePublishAt' | 'externalUrl')[];
  exclude?: ('emptyPages' | 'futurePublishAt' | 'externalUrl')[];
  _sort?: Sort<
    Pick<Chapter, 'createdAt' | 'updatedAt' | 'publishAt' | 'readableAt' | 'volume' | 'chapter'>
  >;
};
export type GetChaptersByMangaId = RequestHandler<
  { id: string },
  SuccessfulResponse<Chapter[]>,
  null,
  GetChaptersByMangaIdQuery
>;

export const getChaptersByComicId: GetChaptersByMangaId = async (req, res, next) => {
  try {
    const { id: mangaId } = req.params;
    const { _limit, _page, _sort, ...query } = req.query;

    const queryParams: MangaFeedQuery = {
      exclude: query.exclude,
      include: query.include,
      limit: _limit,
      offset: calculateOffset(_limit, _page),
      order: _sort,
    };

    const response = await mangadexController.getChaptersByMangaId(mangaId, queryParams);
    const { data, meta } = response;

    const result: SuccessfulResponse<Chapter[]> = {
      data,
    };

    if (_limit && _page) {
      result.metadata = {
        pagination: generatePaginationMeta({
          page: _page,
          perPage: _limit,
          endpoint: `${BASE_ENDPOINT}/${mangaId}/chapters`,
          totalItems: meta.totalItems,
          totalPages: meta.totalPages,
        }),
      };
    }

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

type GetChapterContent = RequestHandler<{ id: string }, SuccessfulResponse<Chapter['content']>>;

export const getChapterContent: GetChapterContent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const ChapterContent = await mangadexController.getChapterContent(id);

    return res.json({ data: ChapterContent });
  } catch (error) {
    next(error);
  }
};
