import { FilterQuery } from 'mongoose';

import { FollowModel } from '../models';
import { GetRequestArgs } from '../types/api.type';
import { Comic } from '../types/comic.type';
import { Follow } from '../types/follow.type';
import Pipeline from '../utils/Pipeline.util';

const projectFields = <T extends string>(projectionString: T) => {
  projectionString = projectionString.replace('id', '_id') as T;
  const allExclusion = projectionString.split(' ').every((field) => field.startsWith('-'));
  if (allExclusion) return `${projectionString} -follower` as T;
  return projectionString;
};

export const _Pipeline = new Pipeline();

export const getFollows = async ({
  _page = 1,
  _limit = 1,
  ...filter
}: GetRequestArgs<Follow> & FilterQuery<Follow>) => {
  if (filter._select) filter._select = projectFields(filter._select);
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

export const getFollow = async (filter: Omit<GetRequestArgs<Follow>, '_limit' | '_page'>) => {
  if (filter._select) filter._select = projectFields(filter._select);
  else filter._select = '-follower';

  const pipeline = _Pipeline.generate(filter);
  pipeline.push({ $limit: 1 });

  const results = await FollowModel.aggregate<Omit<Follow<string, string | Comic>, 'follower'>>(
    pipeline
  );

  return results[0] || null;
};

export const createFollow = async (follow: Pick<Follow, 'follower' | 'following'>) => {
  return await FollowModel.create(follow);
};

export const removeFollow = async (filter: Parameters<typeof FollowModel.deleteOne>[0]) => {
  return await FollowModel.deleteOne(filter);
};
