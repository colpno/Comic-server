import mongoose from 'mongoose';

import { MongoDoc } from '../types/common.type';

interface Follow {
  follower: mongoose.Types.ObjectId;
  following: string;
  addedAt: Date;
}

const schema = new mongoose.Schema<Follow>(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    following: {
      type: String,
      required: true,
    },
    addedAt: {
      type: Date,
      default: Date.now,
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
