import mongoose from 'mongoose';

import { User as OriUser } from '../types/user.type';

type User = Omit<OriUser, 'id'>;

const model = new mongoose.Schema<User>({
  email: { type: String, required: true, unique: true },
  password: {
    hashed: { type: String, required: true },
    salt: { type: String, required: true },
  },
  refreshToken: { type: String },
});

const UserModel = mongoose.model<User>('users', model);

export default UserModel;
