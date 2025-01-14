import { FilterQuery } from 'mongoose';

import { FollowModel } from '../models';
import { GetRequestArgs } from '../types/api.type';
import { Follow } from '../types/follow.type';
import { toObjectId } from '../utils/converter.util';
import Pipeline from '../utils/Pipeline.util';

const filterToObjectId = (filter: FilterQuery<Follow>) => {
  if (filter.id) filter.id = toObjectId(`${filter.id}`);
  if (filter.follower) filter.follower = toObjectId(`${filter.follower}`);
};

export const _Pipeline = new Pipeline();

export const getFollows = async ({
  _page = 1,
  _limit = 1,
  ...filter
}: GetRequestArgs<Follow> & FilterQuery<Follow>) => {
  if (filter._select) filter._select += ' -follower';
  else filter._select = '-follower';

  const pipeline = _Pipeline.generate(filter);

  const result = await FollowModel.aggregate<Omit<Follow, 'follower'>>(pipeline);

  const { _sort, ...otherQueries } = filter;

  const count = await FollowModel.aggregate(_Pipeline.countingPipeline(otherQueries, pipeline));

  const total = count?.[0]?.total || 0;

  return {
    total,
    totalPages: Math.ceil(total / _limit),
    page: _page || 1,
    perPage: _limit,
    pageSize: result.length,
    data: result,
  };
};

export const createFollow = async (follow: Pick<Follow, 'follower' | 'following'>) => {
  return await FollowModel.create(follow);
};

export const addFollow = async (
  filter: FilterQuery<Follow>,
  following: Follow['following'][number]
) => {
  filterToObjectId(filter);

  return (await FollowModel.findOneAndUpdate(
    filter,
    {
      $addToSet: { following },
    },
    { new: true }
  )) as unknown as Follow;
};

export const removeFollow = async (followerId: Follow['follower'], idToRemove: string) => {
  return await FollowModel.updateOne(
    { follower: toObjectId(followerId) },
    { $pull: { following: idToRemove } }
  );
};
