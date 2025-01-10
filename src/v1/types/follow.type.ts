import { Comic } from './comic.type';
import { User } from './user.type';

export interface Follow<U extends string | User = string, C extends string[] | Comic[] = string[]> {
  id: string;
  follower: U;
  following: C;
  createdAt: string;
  updatedAt: string;
}
