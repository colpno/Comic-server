"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateErrorMetadata = exports.generatePaginationMeta = void 0;
const generatePaginationMeta = ({ page, perPage, endpoint, totalItems, totalPages, }) => ({
    currentPage: page,
    links: {
        next: page < totalPages ? `${endpoint}?_limit=${perPage}&_page=${page + 1}` : undefined,
        previous: page > 0 ? `${endpoint}?_limit=${perPage}&_page=${page - 1}` : undefined,
    },
    perPage: perPage,
    totalItems,
    totalPages,
});
exports.generatePaginationMeta = generatePaginationMeta;
const generateErrorMetadata = (req, override) => (Object.assign({ requestId: req.headers['x-request-id'], timestamp: new Date().toISOString(), endpoint: req.url, httpMethod: req.method, stackTrace: '', errorName: '', environment: process.env.NODE_ENV }, override));
exports.generateErrorMetadata = generateErrorMetadata;
//# sourceMappingURL=meta.util.js.map