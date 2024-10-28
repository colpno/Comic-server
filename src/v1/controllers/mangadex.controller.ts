import axios from 'axios';

import { mangadexToComic } from '../services/mangadex.service';
import { Comic } from '../types/comic.type';
import { MangaListQuery, Response as MangaDexResponse } from '../types/mangadex.type';

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
