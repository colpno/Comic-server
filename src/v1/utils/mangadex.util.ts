import { ResponseManga } from '../types/mangadex.type';

type MangaRelationship = ResponseManga['relationships'][number]['type'];

export const toMangaDexEmbedValue = (
  embed?: MangaRelationship | { path: MangaRelationship } | { path: MangaRelationship }[]
): MangaRelationship[] | undefined => {
  if (!embed) {
    return undefined;
  }

  if (Array.isArray(embed)) {
    return embed.map((e) => (typeof e === 'object' ? e.path : e));
  }

  return typeof embed === 'object' ? [embed.path] : [embed];
};

export const calculateOffset = (limit?: number, page?: number): number | undefined => {
  return limit && page ? (page - 1) * limit : undefined;
};
