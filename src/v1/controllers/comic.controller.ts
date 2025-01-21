import { RequestHandler } from 'express';

import { BASE_ENDPOINT } from '../constants/common.constant';
import { comicService } from '../services';
import { GetRequestArgs, SuccessfulResponse } from '../types/api.type';
import { Chapter } from '../types/chapter.type';
import { Comic } from '../types/comic.type';
import { MangaListQuery, ResponseManga } from '../types/mangadex.type';
import { Error400 } from '../utils/error.utils';
import { toMangaDexEmbedValue } from '../utils/mangadex.util';
import { generatePaginationMeta } from '../utils/meta.util';
import { mangadexController } from './';
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

type GetReadingChapterReturnType = {
  comic: Pick<Comic, 'id' | 'title' | 'coverImageUrl'>;
  chapter: Chapter;
};
export type GetReadingChapter = RequestHandler<
  { title: string; chapter: string },
  SuccessfulResponse<GetReadingChapterReturnType>
>;

export const getReadingChapter: GetReadingChapter = async (req, res, next) => {
  try {
    const { chapter: chapterNumber, title } = req.params;

    // Get comic by title
    const comic = await getMangaByTitle(title, { includes: ['cover_art'] });
    if (!comic) {
      throw new Error400('Comic not found');
    }

    // Get chapters by comic id
    const { data: chapters, meta } = await mangadexController.getChaptersByMangaId(comic.id);

    // Get current chapter
    const currentChapterIndex = chapters.findIndex((c) => c.chapter === chapterNumber);
    if (currentChapterIndex === -1) {
      throw new Error400('Chapter not found');
    }
    const chapter = chapters[currentChapterIndex];

    // Get chapter content
    const images = await mangadexController.getChapterContent(chapter.id);
    chapter.content = images;

    // Prepare pagination links
    const nextChapter =
      currentChapterIndex < chapters.length - 1 ? chapters[currentChapterIndex + 1] : null;
    const previousChapter = currentChapterIndex > 0 ? chapters[currentChapterIndex - 1] : null;

    const nextChapterLink = nextChapter?.chapter
      ? `/comics/${title}/reading/${nextChapter.chapter}`
      : undefined;
    const previousChapterLink = previousChapter?.chapter
      ? `/comics/${title}/reading/${previousChapter.chapter}`
      : undefined;

    return res.json({
      data: {
        comic: {
          id: comic.id,
          title: comic.title,
          coverImageUrl: comic.coverImageUrl,
        },
        chapter,
      },
      metadata: {
        pagination: {
          currentPage: 1,
          perPage: 1,
          totalItems: meta.totalItems,
          totalPages: meta.totalPages,
          links: {
            next: nextChapterLink,
            previous: previousChapterLink,
          },
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
