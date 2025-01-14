import { FilterQuery } from 'mongoose';

import { FollowModel } from '../models';
import { Follow } from '../types/follow.type';
import { toObjectId } from '../utils/converter.util';
import Pipeline from '../utils/Pipeline.util';

const filterToObjectId = (filter: FilterQuery<Follow>) => {
  if (filter.id) filter.id = toObjectId(`${filter.id}`);
  if (filter.follower) filter.follower = toObjectId(`${filter.follower}`);
};

export const _Pipeline = new Pipeline();

export const getFollow = async (filter: FilterQuery<Follow>) => {
  filterToObjectId(filter);

  const result = await FollowModel.find(filter);

  return (result[0] as unknown as Follow) || null;
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
