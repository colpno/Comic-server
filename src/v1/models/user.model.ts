import mongoose from 'mongoose';

import { User } from '../types/user.type';

const model = new mongoose.Schema<User>({
  email: { type: String, required: true, unique: true },
  password: {
    hashed: { type: String, required: true },
    salt: { type: String, required: true },
  },
});

const UserModel = mongoose.model('users', model);

export default UserModel;
