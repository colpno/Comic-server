import { RequestHandler } from 'express';

import { userService } from '../services';
import { SuccessfulResponse } from '../types/api.type';
import { MongoDoc } from '../types/common.type';
import { User } from '../types/user.type';
import { toObjectId } from '../utils/converter.util';

export type GetUser = RequestHandler<
  {},
  SuccessfulResponse<Pick<MongoDoc<User>, 'email' | 'createdAt' | 'updatedAt'>>
>;

export const getUser: GetUser = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const data = await userService.getUser({ _id: toObjectId(userId) });

    return res.status(200).json({
      data: {
        email: data.email,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

type UpdateUserBody = Partial<Pick<User, 'email'>> & {
  password?: string;
  passwordVerification?: string;
};
export type UpdateUser = RequestHandler<{}, unknown, UpdateUserBody>;

export const updateUser: UpdateUser = async (req, res, next) => {
  try {
    const { password, passwordVerification, ...restBody } = req.body;
    const { userId } = req.user;

    // Check if passwords match
    if (password !== passwordVerification) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Update user
    const updatePayload: Parameters<typeof userService.updateUser>[0] = { ...restBody };
    if (password) updatePayload.password = password;
    await userService.updateUser({ _id: toObjectId(userId) }, updatePayload);

    return res.status(200).json({ message: 'User updated' });
  } catch (error) {
    next(error);
  }
};
