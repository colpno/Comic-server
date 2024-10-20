export interface Chapter {
  id: string;
  title: string;
  /** Belongs to which volume. */
  volume?: string;
  /** The chapter number in numeric. */
  chapter?: string;
  /** Urls. */
  content?: string[];
  publishAt: string | null;
  readableAt: string | null;
  createdAt: string;
  updatedAt: string;
  /** The number of images. */
  pages?: number;
}
