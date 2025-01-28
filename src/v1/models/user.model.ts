import mongoose from 'mongoose';

import { MongoDoc } from '../types/common.type';
import { User as OriUser } from '../types/user.type';

type User = Omit<OriUser, 'id'>;

const schema = new mongoose.Schema<User>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: {
    hashed: { type: String, required: true },
    salt: { type: String, required: true },
  },
  refreshToken: { type: String },
});

interface PostFindResult {
  _doc: Partial<Pick<MongoDoc<User>, '_id' | '__v'>> &
    Omit<MongoDoc<User>, '_id' | '__v'> & { id: string };
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

schema.post('findOne', function (result: PostFindResult) {
  if (result) {
    const { _doc } = result;
    const { _id, __v, ...rest } = _doc;
    rest.id = _id!;
    return mongoose.overwriteMiddlewareResult(rest);
  }
});

const UserModel = mongoose.model<User>('users', schema);

export default UserModel;
