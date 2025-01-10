import { ResponseManga } from '../types/mangadex.type';

type MangaRelationship = ResponseManga['relationships'][number]['type'];

export const toMangaDexEmbedValue = (
  embed?: MangaRelationship | MangaRelationship[]
): MangaRelationship[] | undefined => {
  if (!embed) return undefined;
  return Array.isArray(embed) ? embed : [embed];
};

export const calculateOffset = (limit?: number, page?: number): number | undefined => {
  return limit && page ? (page - 1) * limit : undefined;
};
