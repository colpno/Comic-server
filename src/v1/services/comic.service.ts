import { GetComics } from '../controllers/comic.controller';
import { getMangaList, getTagIdList } from '../controllers/mangadex.controller';
import { calculateOffset, toMangaDexEmbedValue } from '../utils/mangadex.util';

export const getComicList = async ({
  includedTags,
  _embed,
  _sort,
  _limit,
  _page,
  ...query
}: Parameters<GetComics>[0]['query']) => {
  const tagIds =
    includedTags && includedTags.length > 0 ? await getTagIdList(includedTags) : undefined;

  const result = await getMangaList({
    ...query,
    includedTags: tagIds,
    includes: toMangaDexEmbedValue(_embed),
    order: _sort,
    limit: _limit,
    offset: calculateOffset(_limit, _page),
  });

  return result;
};
