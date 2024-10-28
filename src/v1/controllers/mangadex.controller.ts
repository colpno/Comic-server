import axios from 'axios';

import { mangadexToChapter, mangadexToComic } from '../services/mangadex.service';
import { Chapter } from '../types/chapter.type';
import { Comic } from '../types/comic.type';
import {
  MangaByIdQuery,
  MangaFeedQuery,
  MangaListQuery,
  Response as MangaDexResponse,
} from '../types/mangadex.type';

const MANGADEX_API_URL = 'https://api.mangadex.org';

export const getTagIdList = async (tagNames: string[]) => {
  try {
    const tags = await axios<MangaDexResponse<'collection', 'tag'>>(
      `${MANGADEX_API_URL}/manga/tag`
    );

    const tagIds = tags.data.data
      .filter((tag) => tagNames.includes(tag.attributes.name.en))
      .map((tag) => tag.id);

    return tagIds;
  } catch (error) {
    throw error;
  }
};

export const getMangaList = async (query: MangaListQuery) => {
  try {
    const filters = query;
    const url = `${MANGADEX_API_URL}/manga`;

    const response = await axios.get<MangaDexResponse<'collection', 'manga'>>(url, {
      params: filters,
    });
    const { data } = response;

    let manga: Comic[] = data.data.map((manga) => mangadexToComic(manga));

    const meta = {
      page: data.offset / data.limit + 1,
      limit: data.limit,
      totalItems: data.total,
      totalPages: Math.ceil(data.total / data.limit),
    };

    return {
      data: manga,
      meta,
    };
  } catch (error) {
    throw error;
  }
};

export const getMangaById = async (mangaId: string, query: MangaByIdQuery) => {
  try {
    const url = `${MANGADEX_API_URL}/manga/${mangaId}`;

    const response = await axios.get<MangaDexResponse<'entity', 'manga'>>(url, {
      params: query,
    });

    const comic: Comic = mangadexToComic(response.data.data);

    return comic;
  } catch (error) {
    throw error;
  }
};

export const getChaptersByMangaId = async (mangaId: string, query: MangaFeedQuery) => {
  try {
    const { limit, offset, order, include: includes, exclude: excludes } = query;
    const url = `${MANGADEX_API_URL}/manga/${mangaId}/feed`;

    const includeParam = includes?.reduce((acc, include) => {
      acc[`include${include[0].toUpperCase()}${include.slice(1)}`] = 1;
      return acc;
    }, {} as Record<string, 1>);

    const excludeParam = excludes?.reduce((acc, exclude) => {
      acc[`exclude${exclude[0].toUpperCase()}${exclude.slice(1)}`] = 0;
      return acc;
    }, {} as Record<string, 0>);

    const response = await axios.get<MangaDexResponse<'collection', 'chapter'>>(url, {
      params: {
        ...includeParam,
        ...excludeParam,
        contentRating: ['safe', 'suggestive'],
        limit,
        offset,
        order,
      },
    });
    const { data } = response;

    const chapters: Chapter[] = data.data.map((chapter) => mangadexToChapter(chapter));

    return chapters;
  } catch (error) {
    throw error;
  }
};
