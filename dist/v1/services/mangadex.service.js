"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mangadexToChapter = exports.mangadexToComic = void 0;
const groupRelationships = (relationships) => {
    const grouped = [...relationships].reduce((acc, relationship) => {
        const { type, attributes, id } = relationship;
        // Initialize the array if it doesn't exist.
        if (!acc[type]) {
            acc[type] = [];
        }
        // Push the relationship if embedded or ID to the array.
        if (attributes) {
            acc[type].push(relationship);
        }
        else {
            !acc[type].includes(id) && acc[type].push(id);
        }
        return acc;
    }, {});
    return grouped;
};
const mangadexToComic = (manga) => {
    let cover = '';
    let relationships;
    if ('relationships' in manga) {
        const coverArt = manga.relationships.find((relationship) => relationship.type === 'cover_art');
        const coverFilename = (coverArt === null || coverArt === void 0 ? void 0 : coverArt.attributes) && 'fileName' in coverArt.attributes
            ? coverArt.attributes.fileName
            : null;
        cover = coverFilename ? `https://uploads.mangadex.org/covers/${manga.id}/${coverFilename}` : '';
        relationships = groupRelationships(manga.relationships);
    }
    const authors = (relationships === null || relationships === void 0 ? void 0 : relationships.author) || undefined;
    const artists = (relationships === null || relationships === void 0 ? void 0 : relationships.artist) || undefined;
    return {
        id: manga.id,
        type: manga.type,
        title: manga.attributes.title.en,
        altTitles: manga.attributes.altTitles.reduce((acc, title) => {
            title.en && acc.push(title.en);
            return acc;
        }, []),
        description: manga.attributes.description.en,
        isLocked: manga.attributes.isLocked,
        lastVolume: manga.attributes.lastVolume || undefined,
        /** Numeric */
        lastChapter: manga.attributes.lastChapter || undefined,
        status: manga.attributes.status,
        year: manga.attributes.year,
        contentRating: manga.attributes.contentRating === 'suggestive' ? 'suggestive' : undefined,
        tags: manga.attributes.tags.map((tag) => {
            var _a;
            return ({
                id: tag.id,
                name: tag.attributes.name.en,
                description: (_a = tag.attributes.description) === null || _a === void 0 ? void 0 : _a.en,
                group: tag.attributes.group,
            });
        }),
        state: manga.attributes.state,
        /** This is a boolean value that indicates whether the chapter numbers reset when a new volume is created. */
        chapterNumbersResetOnNewVolume: manga.attributes.chapterNumbersResetOnNewVolume,
        createdAt: manga.attributes.createdAt,
        updatedAt: manga.attributes.updatedAt,
        /** Chapter ID. */
        latestUploadedChapter: manga.attributes.latestUploadedChapter || undefined,
        coverImageUrl: cover,
        chapters: [],
        // /** Comic IDs. */
        related: relationships === null || relationships === void 0 ? void 0 : relationships.manga,
        authors: authors === null || authors === void 0 ? void 0 : authors.map((a) => {
            if (typeof a === 'string')
                return a;
            return { id: a.id, name: a.attributes.name || 'Unknown' };
        }),
        artists: artists === null || artists === void 0 ? void 0 : artists.map((a) => {
            if (typeof a === 'string')
                return a;
            return { id: a.id, name: a.attributes.name || 'Unknown' };
        }),
    };
};
exports.mangadexToComic = mangadexToComic;
const mangadexToChapter = (chapter) => ({
    id: chapter.id,
    title: chapter.attributes.title,
    volume: chapter.attributes.volume || undefined,
    chapter: chapter.attributes.chapter || undefined,
    content: undefined,
    publishAt: chapter.attributes.publishAt || undefined,
    readableAt: chapter.attributes.readableAt || undefined,
    createdAt: chapter.attributes.createdAt,
    updatedAt: chapter.attributes.updatedAt,
    pages: chapter.attributes.pages || undefined,
});
exports.mangadexToChapter = mangadexToChapter;
//# sourceMappingURL=mangadex.service.js.map