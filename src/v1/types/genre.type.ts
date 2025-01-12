export interface Genre {
  id: string;
  name: string;
  description?: string;
  group: 'content' | 'format' | 'genre' | 'theme';
}
