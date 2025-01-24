import axios from 'axios';

import { HOST_URL } from '../../configs/app.conf';
import { mangadexToChapter, mangadexToComic } from '../services/mangadex.service';
import { Chapter } from '../types/chapter.type';
import { Comic } from '../types/comic.type';
import {
  ChapterImages,
  MangaFeedQuery,
  MangaListQuery,
  Response as MangaDexResponse,
} from '../types/mangadex.type';

const BASE_URL = 'https://api.mangadex.org' as const;
const MANGA_URL = `${BASE_URL}/manga` as const;
const TAG_URL = `${MANGA_URL}/tag` as const;
const getMangaChaptersUrl = (mangaId: string) => `${BASE_URL}/manga/${mangaId}/feed` as const;
const getChapterImagesUrl = (chapterId: string) =>
  `${BASE_URL}/at-home/server/${chapterId}` as const;

export const getTagList = async () => {
  try {
    const res = await axios<MangaDexResponse<'collection', 'tag'>>(TAG_URL);
    return res.data.data;
  } catch (error) {
    throw error;
  }
};

export const getTagIdList = async (tagNames: string[]) => {
  try {
    const tags = await axios<MangaDexResponse<'collection', 'tag'>>(TAG_URL);

    const tagIds = tags.data.data
      .filter((tag) =>
        tagNames
          .map((tagName) => tagName.toLowerCase())
          .includes(tag.attributes.name.en.toLowerCase())
      )
      .map((tag) => tag.id);

    return tagIds;
  } catch (error) {
    throw error;
  }
};

export const getMangaList = async (query: MangaListQuery) => {
  try {
    const response = await axios.get<MangaDexResponse<'collection', 'manga'>>(MANGA_URL, {
      params: {
        contentRating: ['safe', 'suggestive'],
        availableTranslatedLanguage: ['en'],
        ...query,
      },
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

export const getMangaByTitle = async (
  titleQuery: string,
  query?: Pick<MangaListQuery, 'includes'>
) => {
  try {
    const title = titleQuery.replace(/-/g, ' ');

    const response = await axios.get<MangaDexResponse<'collection', 'manga'>>(MANGA_URL, {
      params: {
        contentRating: ['safe', 'suggestive'],
        availableTranslatedLanguage: ['en'],
        ...query,
        title,
      },
    });

    // Find the manga with the exact title
    const manga = response.data.data.find(
      (manga) => manga.attributes.title.en.toLowerCase() === title.toLowerCase()
    );

    if (!manga) return null;

    const comic: Comic = mangadexToComic(manga);

    return comic;
  } catch (error) {
    throw error;
  }
};

export const getChaptersByMangaId = async (mangaId: string, query?: MangaFeedQuery) => {
  try {
    const { limit, offset, order, include: includes, exclude: excludes } = query || {};
    const url = getMangaChaptersUrl(mangaId);

    const includeParam = includes?.reduce((acc, include) => {
      acc[`include${include[0].toUpperCase()}${include.slice(1)}`] = 1;
      return acc;
    }, {} as Record<string, 1>);

    const excludeParam = excludes?.reduce((acc, exclude) => {
      acc[`exclude${exclude[0].toUpperCase()}${exclude.slice(1)}`] = 0;
      return acc;
    }, {} as Record<string, 0>);

    const params = {
      ...includeParam,
      ...excludeParam,
      contentRating: ['safe', 'suggestive'],
      translatedLanguage: ['en'],
      limit,
      offset,
      order,
    };

    const response = await axios.get<MangaDexResponse<'collection', 'chapter'>>(url, {
      params,
    });
    const { data, ...restResponse } = response.data;

    const chapters: Chapter[] = data.map((chapter) => mangadexToChapter(chapter));

    const meta = {
      page: restResponse.offset / restResponse.limit + 1,
      limit: restResponse.limit,
      totalItems: restResponse.total,
      totalPages: Math.ceil(restResponse.total / restResponse.limit),
    };

    return {
      data: chapters,
      meta,
    };
  } catch (error) {
    throw error;
  }
};

export const getChapterContent = async (chapterId: Chapter['id']) => {
  const url = getChapterImagesUrl(chapterId);
  const proxyUrl = `${HOST_URL}/proxy`;

  const response = await axios.get<ChapterImages>(url);
  const { data } = response;

  const result: Chapter['content'] = [];
  const imageLength = data.chapter.data.length;
  for (let i = 0; i < imageLength; i++) {
    const imageFile = data.chapter.data[i];
    const imageUrl = `${data.baseUrl}/data/${data.chapter.hash}/${imageFile}`;
    const compressedFile = data.chapter.dataSaver[i];
    const compressedUrl = `${data.baseUrl}/data-saver/${data.chapter.hash}/${compressedFile}`;

    result.push({
      data: `${proxyUrl}/${imageUrl}`,
      dataSaver: `${proxyUrl}/${compressedUrl}`,
    });
  }

  return result;
};
