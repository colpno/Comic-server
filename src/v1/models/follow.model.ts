import mongoose from 'mongoose';

import { MongoDoc } from '../types/common.type';
import { Follow as OriFollow } from '../types/follow.type';
import { arrayMinLength } from '../utils/validation.util';

interface Follow extends Pick<OriFollow, 'following'> {
  follower: mongoose.Types.ObjectId;
}

const schema = new mongoose.Schema<Follow>(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    following: {
      type: [String],
      required: true,
      validate: [arrayMinLength(1), 'At least one following is required'],
    },
  },
  { timestamps: true }
);

interface PostFindResult {
  _doc: Partial<Pick<MongoDoc<Follow>, '_id' | '__v'>> &
    Omit<MongoDoc<Follow>, '_id' | '__v'> & { id: string };
}

schema.post('find', function (result: PostFindResult[]) {
  if (Array.isArray(result)) {
    const results = result.map(({ _doc }) => {
      const { _id, __v, ...rest } = _doc;
      rest.id = _id!;
      return rest;
    });
    return mongoose.overwriteMiddlewareResult(results);
  }
});

const FollowModel = mongoose.model<Follow>('follows', schema);

export default FollowModel;
