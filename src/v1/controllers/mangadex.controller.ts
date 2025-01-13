import axios from 'axios';

import { mangadexToChapter, mangadexToComic } from '../services/mangadex.service';
import { Chapter } from '../types/chapter.type';
import { Comic } from '../types/comic.type';
import {
  ChapterImages,
  MangaByIdQuery,
  MangaFeedQuery,
  MangaListQuery,
  Response as MangaDexResponse,
} from '../types/mangadex.type';

const BASE_URL = 'https://api.mangadex.org' as const;
const MANGA_URL = `${BASE_URL}/manga` as const;
const TAG_URL = `${MANGA_URL}/tag` as const;
const getSpecificMangaUrl = (mangaId: string) => `${BASE_URL}/manga/${mangaId}` as const;
const getMangaChaptersUrl = (mangaId: string) => `${BASE_URL}/manga/${mangaId}/feed` as const;
const getChapterImagesUrl = (chapterId: string) =>
  `${BASE_URL}/at-home/server/${chapterId}` as const;

export const getTagList = async () => {
  try {
    const { data } = await axios<MangaDexResponse<'collection', 'tag'>>(TAG_URL);

    // Remove illegal tags
    const illegalTags = ['Incest', 'Sexual Violence'];
    const tags = data.data.filter((tag) => !illegalTags.includes(tag.attributes.name.en));

    return tags;
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
    const filters = query;

    const response = await axios.get<MangaDexResponse<'collection', 'manga'>>(MANGA_URL, {
      params: {
        contentRating: ['safe', 'suggestive'],
        ...filters,
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

export const getMangaById = async (mangaId: string, query: MangaByIdQuery) => {
  try {
    const url = getSpecificMangaUrl(mangaId);

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
    const url = getMangaChaptersUrl(mangaId);

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

export const getChapterContent = async (chapterId: Chapter['id']) => {
  const url = getChapterImagesUrl(chapterId);

  const response = await axios.get<ChapterImages>(url);
  const { data } = response;

  const result: Chapter['content'] = [];
  const imageLength = data.chapter.data.length;
  for (let i = 0; i < imageLength; i++) {
    const image = data.chapter.data[i];
    const compressed = data.chapter.dataSaver[i];

    result.push({
      data: `${data.baseUrl}/data/${data.chapter.hash}/${image}`,
      dataSaver: `${data.baseUrl}/data/${data.chapter.hash}/${compressed}`,
    });
  }

  return result;
};
