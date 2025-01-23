"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiQuery_util_1 = __importDefault(require("./ApiQuery.util"));
class Pipeline extends ApiQuery_util_1.default {
    constructor({ allowedQueries = {}, fieldTypeReferences = {}, fieldMap = {}, } = {}) {
        super(allowedQueries);
        this.fieldTypeReferences = fieldTypeReferences;
        this.fieldMap = fieldMap;
    }
    generate(_a) {
        var { _embed, _sort, _select, _limit, _page } = _a, _filters = __rest(_a, ["_embed", "_sort", "_select", "_limit", "_page"]);
        const pipeline = [this.matchingPipeline(_filters)];
        if (_embed) {
            pipeline.push(...this.embeddingPipeline(_embed));
        }
        if (_sort) {
            pipeline.push(this.sortingPipeline(_sort));
        }
        if (_select) {
            pipeline.push(this.pickingFieldsPipeline(_select));
        }
        if (_page && _limit) {
            pipeline.push(this.paginatingPipeline(_page, _limit));
        }
        if (_limit) {
            pipeline.push({ $limit: _limit });
        }
        // Add the stage to rename _id to id and remove __v
        pipeline.push({ $addFields: { id: '$_id' } }, { $project: { _id: 0, __v: 0 } });
        return pipeline;
    }
    countingPipeline(queries, pipelines) {
        if (!pipelines) {
            pipelines = this.generate(queries);
        }
        pipelines.push({ $count: 'total' });
        return pipelines;
    }
    pickingFieldsPipeline(_select) {
        const handler = () => {
            return _select.split(' ').reduce((acc, select) => {
                const isExclude = select.startsWith('-');
                const fieldKey = isExclude ? select.slice(1) : select;
                acc[fieldKey] = isExclude ? 0 : 1;
                return acc;
            }, {});
        };
        return { $project: handler() };
    }
    paginatingPipeline(_page, _limit) {
        return { $skip: (_page - 1) * _limit };
    }
    sortingPipeline(_sort) {
        const sort = Object.entries(_sort).reduce((acc, [key, value]) => {
            acc[key] = value === 'asc' ? 1 : -1;
            return acc;
        }, {});
        return { $sort: sort };
    }
    matchingPipeline(filter) {
        return { $match: this.translateToMongoQuery(filter) };
    }
    embeddingPipeline(_embed) {
        const handler = (embedment, prefixLocalField = '') => {
            var _a, _b, _c;
            const pipelines = [];
            // @ts-ignore
            const embeds = typeof embedment === 'string'
                ? [{ path: embedment }]
                : Array.isArray(embedment)
                    ? embedment
                    : [embedment];
            for (let i = 0; i < embeds.length; i++) {
                const embed = embeds[i];
                /** Keep track of parent field. */
                const localField = prefixLocalField ? `${prefixLocalField}.${embed.path}` : embed.path;
                const lookupPipelines = [];
                if (embed.match) {
                    lookupPipelines.push(this.matchingPipeline(embed.match));
                }
                if (embed.select) {
                    lookupPipelines.push(this.pickingFieldsPipeline(embed.select));
                }
                pipelines.push({
                    $lookup: {
                        from: (_b = (_a = this.fieldMap) === null || _a === void 0 ? void 0 : _a[embed.path]) !== null && _b !== void 0 ? _b : embed.path,
                        localField: localField,
                        foreignField: '_id',
                        pipeline: lookupPipelines,
                        as: localField,
                    },
                });
                if (embed.match || embed.populate) {
                    if ((_c = this.fieldTypeReferences) === null || _c === void 0 ? void 0 : _c[embed.path]) {
                        // Make sure the array field is not empty
                        pipelines.push({
                            $match: {
                                [`${localField}.0`]: {
                                    $exists: true,
                                },
                            },
                        });
                    }
                    else {
                        // To deconstructs the array
                        pipelines.push({
                            $unwind: {
                                path: `$${localField}`,
                            },
                        });
                    }
                }
                // For deep population
                if (embed.populate) {
                    pipelines.push(...handler(embed.populate, localField));
                }
            }
            return pipelines;
        };
        return handler(_embed);
    }
}
exports.default = Pipeline;
//# sourceMappingURL=Pipeline.util.js.map