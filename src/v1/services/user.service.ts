import { FilterQuery } from 'mongoose';

import UserModel from '../models/user.model';
import { User } from '../types/user.type';

export const getUser = async (filter: FilterQuery<User>) => {
  return await UserModel.findOne(filter);
};

export const createUser = async (user: Pick<User, 'email' | 'password'>) => {
  return await UserModel.create(user);
};

export const updateUser = async (filter: FilterQuery<User>, update: Partial<User>) => {
  return await UserModel.findOneAndUpdate(filter, update, { new: true });
};
