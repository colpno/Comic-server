import { FilterQuery } from 'mongoose';

import { UserModel } from '../models';
import { MongoDoc } from '../types/common.type';
import { User } from '../types/user.type';

type FindReturnType = Omit<MongoDoc<User>, '_id'> & Pick<User, 'id'>;

export const getUser = async (filter: FilterQuery<User>) => {
  const user = await UserModel.findOne(filter);

  return user as unknown as FindReturnType;
};

export const createUser = async (data: Pick<User, 'username' | 'email' | 'password'>) => {
  const user = await UserModel.create({
    ...data,
    uuid: crypto.randomUUID(),
  });

  return user as unknown as User;
};

export const updateUser = async (
  filter: FilterQuery<User>,
  update: Parameters<typeof UserModel.findOneAndUpdate>[1]
) => {
  const user = await UserModel.findOneAndUpdate(filter, update, { new: true });

  return user as unknown as FindReturnType;
};
