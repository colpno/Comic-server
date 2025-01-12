import { RequestHandler } from 'express';

import { SuccessfulResponse } from '../types/api.type';
import { Genre } from '../types/genre.type';
import { mangadexController } from './';

type GetGenreListReturnType = SuccessfulResponse<Genre[]>;
export type GetGenreList = RequestHandler<{}, GetGenreListReturnType, null>;

export const getGenreList: GetGenreList = async (_req, res, next) => {
  try {
    const genresRaw = await mangadexController.getTagList();
    const genres: Genre[] = genresRaw.map((genre) => ({
      id: genre.id,
      name: genre.attributes.name.en,
      description: genre.attributes.description?.en,
      group: genre.attributes.group,
    }));

    return res.json({ data: genres });
  } catch (error) {
    next(error);
  }
};
