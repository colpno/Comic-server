import { Chapter } from './chapter.type';
import { MongoDocFields } from './common.type';
import { Artist, Author } from './creator.type';
import { Manga } from './mangadex.type';

type Status = Extract<Manga['status'], 'ongoing' | 'completed' | 'hiatus' | 'cancelled'>;
type State = Extract<Manga['state'], 'published'> | 'draft';
type Type = 'manga' | 'manhwa' | 'manhua';
type ContentRating = 'safe' | 'suggestive';
type TagGroup = 'theme' | 'genre' | 'format';

interface Tag {
  id: string;
  name: string;
  description?: string;
  group: TagGroup;
}

export type Comic = {
  id: string;
  type: Type;
  title: string;
  altTitles?: string[];
  description?: string;
  isLocked: boolean; // false by default
  lastVolume?: string;
  lastChapter?: string;
  status: Status;
  year: number;
  contentRating?: ContentRating;
  tags: Tag[];
  state: State;
  /** This is a boolean value that indicates whether the chapter numbers reset when a new volume is created. */
  chapterNumbersResetOnNewVolume: boolean;
  chapters: (Chapter | Chapter['id'])[];
  /** Chapter ID. */
  latestUploadedChapter?: Chapter['id'];
  coverImageUrl: string;
  /** Comic IDs. */
  related?: string[];
  /** Authors id or authors */
  authors: (Author | string)[];
  /** Artists id or artists */
  artists: (Artist | string)[];
} & Pick<MongoDocFields, 'createdAt' | 'updatedAt'>;

export interface ComicClient extends Omit<Comic, 'tags'> {
  'tags.id': Comic['tags'][number]['id'];
  'tags.name': Comic['tags'][number]['name'];
  'tags.description': Comic['tags'][number]['description'];
  'tags.group': Comic['tags'][number]['group'];
}
