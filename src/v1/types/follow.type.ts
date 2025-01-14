import { Comic } from './comic.type';
import { User } from './user.type';

export type Following = { addedAt: string };

export interface Follow<U extends string | User = string, C extends Comic | string = string> {
  id: string;
  follower: U;
  following: C;
  addedAt: string;
  createdAt: string;
  updatedAt: string;
}
