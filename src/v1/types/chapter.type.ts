import { MongoDocFields } from './common.type';

export type Chapter = {
  id: string;
  title: string;
  /** Belongs to which volume. */
  volume?: number;
  /** The chapter number in numeric. */
  chapter?: number;
  /** Urls. */
  content?: ChapterContent[];
  publishAt?: string;
  readableAt?: string;
  /** The number of images. */
  pages?: number;
} & Pick<MongoDocFields, 'createdAt' | 'updatedAt'>;

interface ChapterContent {
  data: string;
  dataSaver?: string;
}
