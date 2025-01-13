import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

import { HTTP_200_OK, HTTP_201_CREATED } from '../../constants/httpCode.constant';
import { ACCESS_TOKEN_SECRET, COOKIE_NAME_ACCESS_TOKEN } from '../configs/common.conf';
import { BASE_ENDPOINT } from '../constants/common.constant';
import { followService } from '../services';
import { GetRequestArgs, SuccessfulResponse } from '../types/api.type';
import { Comic } from '../types/comic.type';
import { JWTPayload } from '../types/common.type';
import { Follow } from '../types/follow.type';
import { Error403, Error500 } from '../utils/error.utils';
import { generatePaginationMeta } from '../utils/meta.util';
import { getMangaList } from './mangadex.controller';

type GetFollowListQuery = Omit<GetRequestArgs<Follow>, '_embed' | '_select' | 'id'> & {
  _embed?: 'following';
};
type GetFollowListReturnType = SuccessfulResponse<Follow['following'] | Comic[]>;
export type GetFollowList = RequestHandler<{}, GetFollowListReturnType, null, GetFollowListQuery>;

export const getFollowList: GetFollowList = async (req, res, next) => {
  try {
    const { _embed, _limit = 1, _page, _sort, ...query } = req.query;

    // Get the follow
    const follows = await followService.getFollows(query);

    let result: GetFollowListReturnType = {
      data: follows.slice(0, 100),
    };

    // Pagination
    if (_page || (_page && _limit)) {
      const totalItems = follows.length;
      const totalPages = Math.ceil(totalItems / (_limit ?? 1));
      const skip = (_page - 1) * _limit;
      const paginated = follows.slice(skip, skip + _limit);

      result = {
        data: paginated,
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
    }

    // Embed comics
    if (_embed) {
      const { data } = await getMangaList({
        ids: result.data as string[],
        order: _sort,
      });
      result.data = data;
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
    const existingFollows = await followService.getFollows({ follower });

    // The user has follows => Add
    if (existingFollows.length > 0) {
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
