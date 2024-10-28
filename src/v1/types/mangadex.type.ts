import { GetRequestArgs } from './api.type';
import { LanguageCode } from './languageCode.type';

/* 
==============================================================================
  Constants
==============================================================================
*/

type State = 'published';
type TagGroup = 'theme' | 'genre' | 'format';
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
type MangaSource =
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
type Title = Partial<Omit<Record<LanguageCode, string>, 'en'>> & { en: string };
type Description = Partial<Record<LanguageCode, string>>;
type Biography = Partial<Record<LanguageCode, string>>;
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

/* 
==============================================================================
  Objects
==============================================================================
*/

export interface Manga {
  title: Title;
  altTitles: Partial<Title>[];
  description: Description;
  /**
   * Indicates whether the manga is nor for reading.
   * @default
   * false
   */
  isLocked: boolean;
  /**
   * External links to the manga.
   */
  links: Partial<Record<MangaSource, string>> | null;
  originalLanguage: LanguageCode | null;
  lastVolume: string | null;
  lastChapter: string | null;
  publicationDemographic: PublicationDemographic | null;
  status: MangaStatus;
  /**
   * Year of release.
   */
  year: number | null;
  contentRating: ContentRating;
  tags: Relationship<'tag'>[];
  state: State;
  /**
   * Indicates whether the chapter numbers reset when a new volume is created.
   */
  chapterNumbersResetOnNewVolume: boolean | null;
  availableTranslatedLanguages: LanguageCode[];
  latestUploadedChapter: string | null;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface CoverArt {
  description: string;
  /**
   * Belongs to which volume.
   */
  volume: string;
  fileName: string;
  locale: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface Creator {
  name: string | null;
  /**
   * Avatar image url.
   */
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

export interface Tag {
  name: Title;
  description: Description | null;
  group: TagGroup;
  version: number;
}

export interface Chapter {
  /**
   * Belongs to which volume.
   */
  volume: string | null;
  /**
   * The chapter number in numeric.
   */
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

export interface ChapterImages {
  result: string;
  /**
   * Segment in the combined url to retrieve the image url.
   */
  baseUrl: string;
  chapter: {
    /**
     * Segment in the combined url to retrieve the image url.
     * **Expires** in **15** mins.
     */
    hash: string;
    /**
     * Image file names.
     */
    data: string[];
    /**
     * Compressed image file names.
     */
    dataSaver: string[];
  };
}

/* 
==============================================================================
  Query parameters
==============================================================================
*/

export interface MangaListQuery {
  /**
   * Manga type.
   * @example
   * 'manga'
   */
  type?: string;
  title?: string;
  status?: MangaStatus;
  /**
   * Release year.
   * @example
   * 2021
   */
  year?: number;
  contentRating?: ContentRating;
  createdAt?: string;
  updatedAt?: string;
  hasAvailableChapters?: string;
  includedTags?: string[];
  /**
   * Relationships to include.
   * @example
   * ['author', 'artist']
   */
  includes?: ResponseManga['relationships'][number]['type'][];
  /**
   * Number of items to return.
   * @default
   * 20
   */
  limit?: number;
  /**
   * Number of items to skip.
   * @default
   * 20
   */
  offset?: number;
  /**
   * Sorting.
   * @example
   * { createdAt: 'desc' }
   */
  order?: GetRequestArgs['_sort'];
}

export interface MangaByIdQuery {
  /**
   * Relationships to include.
   * @example
   * ['author', 'artist']
   */
  includes?: MangaListQuery['includes'];
}

export interface MangaFeedQuery {
  /**
   * Include additional information.
   * @example
   * ['emptyPages', 'futurePublishAt', 'externalUrl']
   */
  include?: ('emptyPages' | 'futurePublishAt' | 'externalUrl')[];
  /**
   * Exclude additional information.
   * @example
   * ['emptyPages', 'futurePublishAt', 'externalUrl']
   */
  exclude?: ('emptyPages' | 'futurePublishAt' | 'externalUrl')[];
  /**
   * Number of items to return.
   * @default
   * 20
   */
  limit?: number;
  /**
   * Number of items to skip.
   * @default
   * 20
   */
  offset?: number;
  /**
   * Sorting.
   * @example
   * { createdAt: 'desc' }
   */
  order?: GetRequestArgs['_sort'];
}

/* 
==============================================================================
  Response
==============================================================================
*/

export type ResponseManga = Required<Relationship<'manga'>> & {
  relationships: (
    | Relationship<'author'>
    | Relationship<'artist'>
    | Relationship<'tag'>
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
export type ResponseTag = Required<Relationship<'tag'>>;
type ResponseDataType = Extract<RelationshipType, 'manga' | 'chapter' | 'tag'>;
export type ResponseData<D extends ResponseDataType> = D extends 'manga'
  ? ResponseManga
  : D extends 'chapter'
  ? ResponseChapter
  : D extends 'tag'
  ? ResponseTag
  : unknown;
/**
 * @description collection: The response is an array of entities.
 * @description entity: The response is a single entity (object).
 */
export type ResponseType = 'collection' | 'entity';
/**
 * @argument D - Data
 * @argument DT - Data Type
 */
export type Response<DT extends ResponseType, D extends ResponseDataType> = DT extends 'collection'
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
      data: ResponseData<D>;
    };

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
