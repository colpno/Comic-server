import { Schema } from 'joi';

import { Joi } from '../configs/joi.conf';
import { Comic } from '../types/comic.type';
import { MangaListQuery } from '../types/mangadex.type';

const allowedTypes: Comic['type'][] = ['manga', 'manhwa', 'manhua'];
const allowedStatuses: Comic['status'][] = ['ongoing', 'completed', 'hiatus', 'cancelled'];
const allowedContentRatings: Comic['contentRating'][] = ['safe', 'suggestive'];
const allowedTagMode: MangaListQuery['includedTagsMode'][] = ['AND', 'OR'];
export const mangadexMangaListSchema: Record<
  keyof Omit<MangaListQuery, 'limit' | 'offset' | 'order' | 'includes'>,
  Schema
> = {
  type: Joi.string().valid(...allowedTypes),
  title: Joi.string(),
  status: Joi.array().items(Joi.string().valid(...allowedStatuses)),
  year: Joi.number().integer().positive().greater(1900).less(2100),
  contentRating: Joi.string().valid(...allowedContentRatings),
  createdAt: Joi.string().isoDate(),
  updatedAt: Joi.string().isoDate(),
  hasAvailableChapters: Joi.string().valid('true', 'false'),
  includedTags: Joi.array().items(Joi.string()),
  includedTagsMode: Joi.string().valid(...allowedTagMode),
  ids: Joi.array().items(Joi.string()).max(100),
  excludedTags: Joi.array().items(Joi.string()),
  excludedTagsMode: Joi.string().valid(...allowedTagMode),
};
