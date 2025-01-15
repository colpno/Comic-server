import { RequestHandler } from 'express';

import { HTTP_200_OK, HTTP_201_CREATED } from '../../constants/httpCode.constant';
import { BASE_ENDPOINT } from '../constants/common.constant';
import { comicService, followService } from '../services';
import { GetRequestArgs, SuccessfulResponse } from '../types/api.type';
import { Comic } from '../types/comic.type';
import { Follow } from '../types/follow.type';
import { MangaListQuery } from '../types/mangadex.type';
import { generatePaginationMeta } from '../utils/meta.util';
import { GetComics } from './comic.controller';

type GetFollowListQuery = Omit<GetRequestArgs<Follow>, '_embed' | 'id'> & {
  _embed?:
    | 'following'
    | {
        path: 'following';
        match?: Omit<MangaListQuery, 'limit' | 'offset' | 'order' | 'includes'>;
        populate?: Parameters<GetComics>[0]['query']['_embed'];
      };
};
type GetFollowListReturnType = SuccessfulResponse<
  Omit<Follow<string, Comic | string>, 'follower'>[]
>;
export type GetFollowList = RequestHandler<{}, GetFollowListReturnType, null, GetFollowListQuery>;

export const getFollowList: GetFollowList = async (req, res, next) => {
  try {
    const { _embed, ...query } = req.query;

    const { data, page, perPage, total, totalPages } = await followService.getFollows(query);

    const result: GetFollowListReturnType = {
      data: data as unknown as GetFollowListReturnType['data'],
      metadata: {
        pagination: generatePaginationMeta({
          page,
          perPage,
          endpoint: `${BASE_ENDPOINT}/follows`,
          totalItems: total,
          totalPages,
        }),
      },
    };

    // Embed following
    if (_embed) {
      const { match = {}, populate } = typeof _embed !== 'string' ? _embed : {};

      // Get comics with ids
      const { data: comics } = await comicService.getComicList({
        ...match,
        ids: data.map(({ following }) => following),
        _embed: populate,
      });

      // Replace following with comic data
      result.data = data.reduce((acc, follow) => {
        const following = comics.find(({ id }) => id === follow.following);

        if (!following) return acc;

        acc = [...acc, { ...follow, following }];

        return acc;
      }, [] as unknown as GetFollowListReturnType['data']);
    }

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

type GetFollowQuery = Partial<
  Omit<Follow, 'following' | 'follower'> &
    Pick<GetRequestArgs<Follow>, '_select'> & {
      follower?: string;
      following?: string;
      _embed?: GetFollowListQuery['_embed'];
    }
>;
type GetFollowReturnType = SuccessfulResponse<Omit<Follow<string, Comic | string>, 'follower'>>;
export type GetFollow = RequestHandler<
  { following: string },
  GetFollowReturnType,
  null,
  GetFollowQuery
>;

export const getFollow: GetFollow = async (req, res, next) => {
  try {
    const { _embed, ...query } = req.query;

    const follow = await followService.getFollow(query);

    // Embed following
    if (_embed) {
      const { match = {}, populate } = typeof _embed !== 'string' ? _embed : {};

      // Get comics with ids
      const { data: comics } = await comicService.getComicList({
        ...match,
        ids: [follow.following as string],
        _embed: populate,
      });

      // Replace following with comic data
      follow.following = comics[0];
    }

    return res.json({ data: follow });
  } catch (error) {
    next(error);
  }
};

export type AddFollowBody = { followingId: string };
export type AddFollow = RequestHandler<{}, unknown, AddFollowBody>;

export const addFollow: AddFollow = async (req, res, next) => {
  try {
    const { followingId } = req.body;
    const { userId } = req.user!;

    // Create
    await followService.createFollow({
      follower: userId,
      following: followingId,
    });
    return res.sendStatus(HTTP_201_CREATED);
  } catch (error) {
    next(error);
  }
};

export type RemoveFollow = RequestHandler<{ id: string }, unknown, null>;

export const removeFollow: RemoveFollow = async (req, res, next) => {
  try {
    const { id: idToRemove } = req.params;
    const { userId } = req.user!;

    await followService.removeFollow(userId, idToRemove);

    return res.sendStatus(HTTP_200_OK);
  } catch (error) {
    next(error);
  }
};
