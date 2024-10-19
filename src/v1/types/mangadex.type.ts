import { LanguageCode } from './languageCode.type';

export type ResponseManga = Required<Relationship<'manga'>> & {
  relationships: (
    | Relationship<'author'>
    | Relationship<'artist'>
    | Relationship<'cover_art'>
    | (Relationship<'manga'> & {
        related?: Extract<
          Related,
          | 'main_story'
          | 'side_story'
          | 'adapted_from'
          | 'spin_off'
          | 'doujinshi'
          | 'same_franchise'
          | 'shared_universe'
          | 'alternate_story'
          | 'alternate_version'
        >;
      })
  )[];
};
export type ResponseChapter = Required<Relationship<'chapter'>> & {
  relationships: (
    | Relationship<'user'>
    | Relationship<'scanlation_group'>
    | Relationship<'manga'>
  )[];
};
export type ResponseData<D extends Extract<RelationshipType, 'manga' | 'chapter'>> =
  D extends 'manga' ? ResponseManga : D extends 'chapter' ? ResponseChapter : unknown;
/**
 * @description collection: The response is an array of entities.
 * @description entity: The response is a single entity (object).
 */
export type ResponseType = 'collection' | 'entity';
/**
 * @argument D - Data
 * @argument DT - Data Type
 */
export type Response<
  DT extends ResponseType,
  D extends Extract<RelationshipType, 'manga' | 'chapter'>
> = DT extends 'collection'
  ? D extends 'manga'
    ? {
        result: 'ok';
        response: DT;
        data: ResponseData<D>[];
        limit: number;
        offset: number;
        total: number;
      }
    : {
        result: 'ok';
        response: DT;
        data: ResponseData<D>[];
      }
  : {
      result: 'ok';
      response: DT;
      data: ResponseData<D>[];
    };

type Description = Partial<Record<LanguageCode, string>>;
type Title = Partial<Omit<Record<LanguageCode, string>, 'en'>> & { en: string };

export interface Chapter {
  volume: string | null;
  chapter: string | null;
  title: string;
  translatedLanguage: string;
  externalUrl: string | null;
  publishAt: string | null;
  readableAt: string | null;
  createdAt: string;
  updatedAt: string;
  pages: number | null;
  version: number;
}

/**
 * @see https://api.mangadex.org/docs/3-enumerations/#manga-content-rating for details.
 */
type ContentRating = 'safe' | 'suggestive' | 'erotica' | 'pornographic';
/**
 * @see https://api.mangadex.org/docs/3-enumerations/#manga-status for details.
 */
type MangaStatus = 'ongoing' | 'completed' | 'hiatus' | 'cancelled';
/**
 * @see https://api.mangadex.org/docs/3-enumerations/#manga-links-data for details.
 */
type MangaLink =
  | 'al'
  | 'ap'
  | 'bw'
  | 'mu'
  | 'nu'
  | 'kt'
  | 'amz'
  | 'ebj'
  | 'mal'
  | 'cdj'
  | 'raw'
  | 'engtl';
/**
 * @see https://api.mangadex.org/docs/3-enumerations/#manga-publication-demographic for details.
 */
type PublicationDemographic = 'shounen' | 'shoujo' | 'seinen' | 'josei';
export interface Manga {
  title: Title;
  altTitles: Partial<Title>[];
  description: Description;
  isLocked: boolean;
  links: Partial<Record<MangaLink, string>> | null;
  originalLanguage: LanguageCode | null;
  lastVolume: string | null;
  lastChapter: string | null;
  publicationDemographic: PublicationDemographic | null;
  status: MangaStatus;
  year: number | null;
  contentRating: ContentRating;
  tags: Relationship<'tag'>[];
  state: State;
  chapterNumbersResetOnNewVolume: boolean | null;
  availableTranslatedLanguages: LanguageCode[];
  latestUploadedChapter: string | null; // uuid
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface CoverArt {
  description: string;
  volume: string;
  fileName: string;
  locale: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

type Biography = Partial<Record<LanguageCode, string>>;
export interface Creator {
  name: string | null;
  imageUrl: string | null;
  biography: Biography | null;
  twitter: string | null;
  pixiv: string | null;
  melonBook: string | null;
  fanBox: string | null;
  booth: string | null;
  namicomi: string | null;
  nicoVideo: string | null;
  skeb: string | null;
  fantia: string | null;
  tumblr: string | null;
  youtube: string | null;
  weibo: string | null;
  naver: string | null;
  website: string | null;
  createdAt: string;
  updatedAt: string;
  version: number;
}

type TagGroup = 'theme' | 'genre' | 'format';
export interface Tag {
  name: Title;
  description: Description | null;
  group: TagGroup;
  version: number;
}

type State = 'published';

/**
 * @see https://api.mangadex.org/docs/3-enumerations/#relationship-types for details.
 */
export type RelationshipType =
  | 'manga'
  | 'chapter'
  | 'cover_art'
  | 'author'
  | 'artist'
  | 'scanlation_group'
  | 'tag'
  | 'user'
  | 'custom_list';
/**
 * @see https://api.mangadex.org/docs/3-enumerations/#manga-related-enum for details.
 */
export type Related =
  | 'monochrome'
  | 'colored'
  | 'preserialization'
  | 'serialization'
  | 'prequel'
  | 'sequel'
  | 'main_story'
  | 'side_story'
  | 'adapted_from'
  | 'spin_off'
  | 'based_on'
  | 'doujinshi'
  | 'same_franchise'
  | 'shared_universe'
  | 'alternate_story'
  | 'alternate_version';
type BaseRelationship = {
  id: string;
};
type RelationshipCoverArt = BaseRelationship & {
  type: Extract<RelationshipType, 'cover_art'>;
  attributes?: CoverArt;
};
type RelationshipCreator = BaseRelationship & {
  type: Extract<RelationshipType, 'author' | 'artist'>;
  attributes?: Creator;
};
type RelationshipComic = BaseRelationship & {
  type: Extract<RelationshipType, 'manga'>;
  attributes?: Manga;
};
type RelationshipTag = BaseRelationship & {
  type: Extract<RelationshipType, 'tag'>;
  attributes: Tag;
  relationships: [];
};
type RelationshipChapter = BaseRelationship & {
  type: Extract<RelationshipType, 'chapter'>;
  attributes?: Chapter;
};
export type Relationship<T extends RelationshipType = 'manga'> = T extends 'cover_art'
  ? RelationshipCoverArt
  : T extends 'author' | 'artist'
  ? RelationshipCreator
  : T extends 'manga'
  ? RelationshipComic
  : T extends 'tag'
  ? RelationshipTag
  : T extends 'chapter'
  ? RelationshipChapter
  : BaseRelationship & {
      type: T;
      attributes?: Record<string, unknown>;
      relationships?: Relationship[];
      related?: Related;
    };
