"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bson_1 = require("bson");
const mongoose_1 = require("mongoose");
const error_utils_1 = require("./error.utils");
class ApiQuery {
    constructor(allowedQueries) {
        /** The operators that can be used in the client request. */
        this.clientProvidedOperators = [
            'like',
            'eq',
            'ne',
            'exists',
            'gt',
            'gte',
            'lt',
            'lte',
            'size',
            'all',
            'in',
            'nin',
        ];
        /** The operators that can be used in the MongoDB query. */
        this.mongoOperators = [
            '$regex',
            '$eq',
            '$ne',
            '$exists',
            '$gt',
            '$gte',
            '$lt',
            '$lte',
            '$size',
            '$not',
            '$all',
            '$in',
            '$nin',
        ];
        this.isMongoOperator = (value) => {
            if (typeof value !== 'object' || value === null)
                return false;
            return Object.keys(value).some((key) => this.mongoOperators.includes(key));
        };
        this.allowedQueries = allowedQueries;
    }
    buildMongoQuery(value, operator) {
        if ((0, mongoose_1.isObjectIdOrHexString)(value)) {
            value = bson_1.ObjectId.createFromHexString(value);
        }
        if (Array.isArray(value) && value.every(mongoose_1.isObjectIdOrHexString)) {
            value = value.map(bson_1.ObjectId.createFromHexString);
        }
        switch (operator) {
            case 'like':
                return { $regex: value, $options: 'i' };
            case 'eq':
                return { $eq: value };
            case 'ne':
                return { $ne: value };
            case 'exists':
                return { $exists: value };
            case 'gt':
                return { $gt: value };
            case 'gte':
                return { $gte: value };
            case 'lt':
                return { $lt: value };
            case 'lte':
                return { $lte: value };
            case 'size':
                if (typeof value === 'object' && value) {
                    for (const [op, val] of Object.entries(value)) {
                        switch (op) {
                            case 'ne':
                                return { ['$not']: { $size: val } };
                            case 'gte':
                                return { [`${val - 1}`]: { $exists: true } };
                            case 'gt':
                                return { [`${val}`]: { $exists: true } };
                            case 'lte':
                                return { [`${val}`]: { $exists: false } };
                            case 'lt':
                                return { [`${val - 1}`]: { $exists: false } };
                            default:
                                throw new error_utils_1.Error400(`Unsupported size operator: ${op}`);
                        }
                    }
                }
                return { $size: value };
            case 'all':
                return { $all: value };
            case 'in':
                return { $in: value };
            case 'nin':
                return { $nin: value };
            case 'or': {
                const conditions = value;
                return {
                    $or: conditions.map((condition) => {
                        const queries = {};
                        for (const [field, operatorsOrString] of Object.entries(condition)) {
                            const obj = { [field]: operatorsOrString };
                            const transformed = this.translateToMongoQuery(obj);
                            Object.assign(queries, transformed);
                        }
                        return queries;
                    }),
                };
            }
            case 'and': {
                const conditions = value;
                return {
                    $and: conditions.map((condition) => {
                        const queries = {};
                        for (const [field, operatorsOrString] of Object.entries(condition)) {
                            const obj = { [field]: operatorsOrString };
                            const transformed = this.translateToMongoQuery(obj);
                            Object.assign(queries, transformed);
                        }
                        return queries;
                    }),
                };
            }
            default:
                return value;
        }
    }
    translateToMongoQuery(input) {
        const translate = (obj) => {
            const result = {};
            for (const [objKey, objValue] of Object.entries(obj)) {
                if (this.clientProvidedOperators.includes(objKey)) {
                    const k = objKey;
                    Object.assign(result, this.buildMongoQuery(objValue, k));
                    continue;
                }
                if (typeof objValue === 'object') {
                    const v = objValue;
                    result[objKey] = translate(v);
                    continue;
                }
                result[objKey] = (0, mongoose_1.isObjectIdOrHexString)(objValue)
                    ? bson_1.ObjectId.createFromHexString(objValue)
                    : objValue;
            }
            return result;
        };
        return translate(input);
    }
}
exports.default = ApiQuery;
//# sourceMappingURL=ApiQuery.util.js.map