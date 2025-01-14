import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

import {
  HTTP_200_OK,
  HTTP_201_CREATED,
  HTTP_204_NO_CONTENT,
} from '../../constants/httpCode.constant';
import { ACCESS_TOKEN_SECRET, COOKIE_NAME_ACCESS_TOKEN } from '../configs/common.conf';
import { BASE_ENDPOINT } from '../constants/common.constant';
import { comicService, followService } from '../services';
import { GetRequestArgs, SuccessfulResponse } from '../types/api.type';
import { Comic } from '../types/comic.type';
import { JWTPayload } from '../types/common.type';
import { Follow } from '../types/follow.type';
import { MangaListQuery } from '../types/mangadex.type';
import { Error403, Error500 } from '../utils/error.utils';
import { generatePaginationMeta } from '../utils/meta.util';
import { GetComics } from './comic.controller';

type GetFollowListQuery = Omit<
  GetRequestArgs<Follow>,
  '_embed' | '_select' | 'id' | '_page' | '_limit'
> &
  Required<Pick<GetRequestArgs<Follow>, '_page' | '_limit'>> & {
    _embed?:
      | 'following'
      | {
          path: 'following';
          match?: Omit<MangaListQuery, 'limit' | 'offset' | 'order' | 'includes'>;
          populate?: Parameters<GetComics>[0]['query']['_embed'];
        };
  };
type GetFollowListReturnType = SuccessfulResponse<
  Omit<Follow<string, string[] | Comic[]>, 'follower'>
>;
export type GetFollowList = RequestHandler<{}, GetFollowListReturnType, null, GetFollowListQuery>;

export const getFollowList: GetFollowList = async (req, res, next) => {
  try {
    const { _embed, _limit = 1, _page, _sort, ...query } = req.query;

    // Check if user has follows
    const follow = await followService.getFollow(query);
    if (!follow) {
      return res.sendStatus(HTTP_204_NO_CONTENT);
    }

    const { follower, ...rest } = follow;

    // Pagination
    const totalItems = rest.following.length;
    const totalPages = Math.ceil(totalItems / _limit);
    const skip = (_page - 1) * _limit;
    const paginated = rest.following.slice(skip, skip + _limit);

    const result: GetFollowListReturnType = {
      data: {
        ...rest,
        following: paginated,
      },
      metadata: {
        pagination: generatePaginationMeta({
          page: _page,
          perPage: _limit,
          endpoint: `${BASE_ENDPOINT}/follows`,
          totalItems,
          totalPages,
        }),
      },
    };

    // Embed following
    if (_embed) {
      const { match = {}, populate } = typeof _embed !== 'string' ? _embed : {};

      const { data } = await comicService.getComicList({
        ...match,
        ids: result.data.following as string[],
        _sort,
        _embed: populate,
      });
      result.data.following = data;
    }

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

export type AddFollowBody = Pick<Follow, 'follower'> & { following: string };
export type AddFollow = RequestHandler<{}, unknown, AddFollowBody>;

export const addFollow: AddFollow = async (req, res, next) => {
  try {
    const { follower, following } = req.body;

    // Check if the user already follows the target
    const existingFollows = await followService.getFollow({ follower });

    // The user has follows => Add
    if (existingFollows) {
      await followService.addFollow({ follower }, following);
      return res.sendStatus(HTTP_200_OK);
    }

    // Create
    await followService.createFollow({
      follower,
      following: [following],
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
    const accessToken = req.cookies?.[COOKIE_NAME_ACCESS_TOKEN];

    jwt.verify(accessToken, ACCESS_TOKEN_SECRET, async (err: unknown, decoded: unknown) => {
      if (err) {
        throw new Error403('Invalid access token');
      }

      const payload = decoded as JWTPayload;
      await followService.removeFollow(payload.userId, idToRemove);

      return res.sendStatus(HTTP_200_OK);
    });

    throw new Error500('Failed to remove the follow');
  } catch (error) {
    next(error);
  }
};
