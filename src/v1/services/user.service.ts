import { FilterQuery } from 'mongoose';

import { UserModel } from '../models';
import { User } from '../types/user.type';
import { toObjectId } from '../utils/converter.util';

const filterToObjectId = (filter: FilterQuery<User>) => {
  if (filter.id) filter.id = toObjectId(`${filter.id}`);
};

export const getUser = async (filter: FilterQuery<User>) => {
  filterToObjectId(filter);

  return await UserModel.findOne(filter);
};

export const createUser = async (user: Pick<User, 'email' | 'password'>) => {
  return await UserModel.create(user);
};

export const updateUser = async (filter: FilterQuery<User>, update: Partial<User>) => {
  filterToObjectId(filter);

  return await UserModel.findOneAndUpdate(filter, update, { new: true });
};
