import axios from 'axios';
import { NextFunction, Request } from 'express';

import { mangadexToChapter, mangadexToComic } from '../services/mangadex.service';
import { GetRequestArgs, Response, SuccessfulResponseContent } from '../types/api.type';
import { Chapter } from '../types/chapter.type';
import { Comic } from '../types/comic.type';
import { Manga, RelationshipType, Response as MangadexResponse } from '../types/mangadex.type';

const MANGADEX_API_URL = 'https://api.mangadex.org';

export type GetMangaRequest = Request<
  {},
  {},
  {},
  qs.ParsedQs &
    Omit<
      GetRequestArgs<
        Pick<
          Manga,
          'title' | 'lastVolume' | 'lastChapter' | 'status' | 'year' | 'contentRating' | 'state'
        >
      >,
      '_embed' | '_select' | '_sort'
    > & {
      includes: Extract<RelationshipType, 'author' | 'artist' | 'cover_art' | 'manga'>[];
    }
>;

export const getManga = async (req: GetMangaRequest, res: Response, next: NextFunction) => {
  try {
    const { _limit, _page, ...filters } = req.query;
    const url = `${MANGADEX_API_URL}/manga`;

    const response = await axios.get<MangadexResponse<'collection', 'manga'>>(url, {
      params: {
        ...filters,
        limit: _limit,
        offset: _page && _limit ? (_page - 1) * _limit : undefined,
      },
    });
    const { data } = response;

    const comics: Comic[] = data.data.map((manga) => mangadexToComic(manga));
    const result: SuccessfulResponseContent = {
      data: comics,
    };
    if (_limit && _page) {
      result.metadata = {
        pagination: {
          currentPage: _page,
          links: {
            next: `/api/v1/mangadex/manga?_limit=${_limit}&_page=${_page + 1}`,
            previous: `/api/v1/mangadex/manga?_limit=${_limit}&_page=${_page - 1}`,
          },
          perPage: _limit,
          totalItems: 100,
          totalPages: 5,
        },
      };
    }

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

export type GetChapterRequest = Request<
  { id: string },
  {},
  {},
  {
    include: ('emptyPages' | 'futurePublishAt' | 'externalUrl')[];
    exclude: ('emptyPages' | 'futurePublishAt' | 'externalUrl')[];
  }
>;

export const getChaptersByMangaId = async (
  req: GetChapterRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { include: includes, exclude: excludes } = req.query;
    const { id: mangaId } = req.params;
    const url = `${MANGADEX_API_URL}/manga/${mangaId}/feed`;

    const axiosParams = {
      ...includes.reduce((acc, include) => {
        acc[`include${include[0].toUpperCase()}${include.slice(1)}`] = 1;
        return acc;
      }, {} as Record<string, 1>),

      ...excludes.reduce((acc, exclude) => {
        acc[`exclude${exclude[0].toUpperCase()}${exclude.slice(1)}`] = 0;
        return acc;
      }, {} as Record<string, 0>),
    };

    const response = await axios.get<MangadexResponse<'collection', 'chapter'>>(url, {
      params: axiosParams,
    });
    const { data } = response;

    const chapters: Chapter[] = data.data.map((chapter) => mangadexToChapter(chapter));
    const result: SuccessfulResponseContent = {
      data: chapters,
    };

    return res.json(result);
  } catch (error) {
    next(error);
  }
};
