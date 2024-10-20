import { Chapter } from './chapter.type';
import { Artist, Author } from './creator.type';
import { Manga } from './mangadex.type';

export interface Comic {
  id: string;
  type: Type;
  title: string;
  altTitles?: string[];
  description?: string;
  isLocked: boolean; // false by default
  /** Numeric */
  lastVolume?: string;
  /** Numeric */
  lastChapter?: string;
  status: Manga['status'];
  year: number;
  contentRating?: ContentRating;
  tags: Tag[];
  state: State;
  /** This is a boolean value that indicates whether the chapter numbers reset when a new volume is created. */
  chapterNumbersResetOnNewVolume: boolean;
  createdAt: string;
  updatedAt: string;
  /** Chapter ID. */
  latestUploadedChapter?: Chapter['id'];
  coverImageUrl: string;
  /** Comic IDs. */
  related?: string[];
  /** Authors id or authors */
  authors: (Author | string)[];
  /** Artists id or artists */
  artists: (Artist | string)[];
}

type State = Extract<Manga['state'], 'published'> | 'draft';

type Type = 'manga' | 'manhwa' | 'manhua';

type ContentRating = 'suggestive';

interface Tag {
  id: string;
  name: string;
  description?: string;
  /** Theme, genre,... */
  group: string;
}
