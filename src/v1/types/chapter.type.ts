import { MongoDocFields } from './common.type';

export type Chapter = {
  id: string;
  title: string;
  volume?: string;
  chapter?: string;
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
