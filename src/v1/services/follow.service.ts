import { FilterQuery } from 'mongoose';

import { FollowModel } from '../models';
import { Follow } from '../types/follow.type';
import Pipeline from '../utils/Pipeline.util';

export const _Pipeline = new Pipeline();

export const getFollows = async (filter: FilterQuery<Follow>) => {
  const result = await FollowModel.find(filter);
  return result[0]?.following || [];
};

export const createFollow = async (follow: Pick<Follow, 'follower' | 'following'>) => {
  return await FollowModel.create(follow);
};

export const addFollow = async (
  filter: FilterQuery<Follow>,
  following: Follow['following'][number]
) => {
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
    { follower: followerId },
    { $pull: { following: idToRemove } }
  );
};
