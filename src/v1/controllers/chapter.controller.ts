import { RequestHandler } from 'express';

import { GetRequestArgs, SuccessfulResponse } from '../types/api.type';
import { getChaptersByMangaId as getChaptersByMangaIdFn } from './mangadex.controller';

type GetChaptersByMangaIdQuery =
  | (Omit<GetRequestArgs, '_select' | '_embed'> & {
      include: ('emptyPages' | 'futurePublishAt' | 'externalUrl')[];
      exclude: ('emptyPages' | 'futurePublishAt' | 'externalUrl')[];
    })
  // There is an error when adding additional query parameters like above: "missing props in ParsedQS" occurs when using getChaptersByMangaId in routes.
  // Some are not facing the issue, but some are.
  // Workaround for the issue:
  | qs.ParsedQs;
export type GetChaptersByMangaId = RequestHandler<
  { id: string },
  SuccessfulResponse,
  {},
  GetChaptersByMangaIdQuery
>;

export const getChaptersByComicId: GetChaptersByMangaId = async (req, res, next) => {
  try {
    const { id: mangaId } = req.params;

    const chapters = await getChaptersByMangaIdFn(mangaId, req.query);

    return res.json({ data: chapters });
  } catch (error) {
    next(error);
  }
};
