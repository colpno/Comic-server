export interface Creator {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export type Author = Creator;

export type Artist = Creator;
