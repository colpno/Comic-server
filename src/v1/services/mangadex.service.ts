import { Chapter } from '../types/chapter.type';
import { Comic } from '../types/comic.type';
import { ResponseChapter, ResponseManga } from '../types/mangadex.type';

export const mangadexToComic = (manga: ResponseManga): Comic => ({
  id: manga.id,
  type: manga.type,
  title: manga.attributes.title.en,
  altTitles: manga.attributes.altTitles.reduce((acc, title) => {
    title.en && acc.push(title.en);
    return acc;
  }, [] as string[]),
  description: manga.attributes.description.en,
  isLocked: manga.attributes.isLocked,
  lastVolume: manga.attributes.lastVolume || undefined,
  /** Numeric */
  lastChapter: manga.attributes.lastChapter || undefined,
  status: manga.attributes.status,
  year: manga.attributes.year!,
  contentRating: manga.attributes.contentRating === 'suggestive' ? 'suggestive' : undefined,
  tags: manga.attributes.tags.map((tag) => ({
    id: tag.id,
    name: tag.attributes.name.en,
    description: tag.attributes.description?.en,
    group: tag.attributes.group,
  })),
  state: manga.attributes.state,
  /** This is a boolean value that indicates whether the chapter numbers reset when a new volume is created. */
  chapterNumbersResetOnNewVolume: manga.attributes.chapterNumbersResetOnNewVolume!,
  createdAt: manga.attributes.createdAt,
  updatedAt: manga.attributes.updatedAt,
  /** Chapter ID. */
  latestUploadedChapter: manga.attributes.latestUploadedChapter || undefined,
  coverImageUrl: '',
  // /** Comic IDs. */
  related: manga.relationships.reduce((acc, relationship) => {
    relationship.type === 'manga' && acc.push(relationship.id);
    return acc;
  }, [] as string[]),
  authors: manga.relationships.reduce((acc, relationship) => {
    relationship.type === 'author' && acc.push(relationship.id);
    return acc;
  }, [] as string[]),
  artists: manga.relationships.reduce((acc, relationship) => {
    relationship.type === 'artist' && acc.push(relationship.id);
    return acc;
  }, [] as string[]),
});

export const mangadexToChapter = (chapter: ResponseChapter): Chapter => ({
  id: chapter.id,
  title: chapter.attributes.title,
  volume: chapter.attributes.volume || undefined,
  chapter: chapter.attributes.chapter || undefined,
  content: undefined,
  publishAt: chapter.attributes.publishAt,
  readableAt: chapter.attributes.readableAt,
  createdAt: chapter.attributes.createdAt,
  updatedAt: chapter.attributes.updatedAt,
  pages: chapter.attributes.pages || undefined,
});
