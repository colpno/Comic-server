import { FilterQuery, PipelineStage } from 'mongoose';

import { AllowedQueries, Embed, GetRequestArgs } from '../types/api.type';
import ApiQuery from './ApiQuery.util';

interface PipelineProps {
  /** @inheritdoc AllowedQueries */
  allowedQueries?: AllowedQueries;
  /**
   * Specify the populated field that is an array in order to handle the populated pipeline properly.
   * @example { actresses: true }
   */
  fieldTypeReferences?: Record<string, true>;
  /**
   * Mapping fields to their corresponding collection, which means the field name is not the same as its collection.
   * @example { movie_id: 'movies' } // movie_id is the field name, movies is its collection name
   */
  fieldMap?: Record<string, string>;
}

export default class Pipeline extends ApiQuery {
  /**
   * Mapping fields to their corresponding collection, which means the field name is not the same as its collection.
   * @example { movie_id: 'movies' } // movie_id is the field name, movies is its collection name
   */
  protected fieldMap: PipelineProps['fieldMap'];
  /**
   * Specify the populated field that is an array in order to handle the populated pipeline properly.
   * @example { actresses: true }
   */
  protected fieldTypeReferences: PipelineProps['fieldTypeReferences'];

  constructor({
    allowedQueries = {},
    fieldTypeReferences = {},
    fieldMap = {},
  }: PipelineProps = {}) {
    super(allowedQueries);
    this.fieldTypeReferences = fieldTypeReferences;
    this.fieldMap = fieldMap;
  }

  public generate<DataType>({
    _embed,
    _sort,
    _select,
    _limit,
    _page,
    ..._filters
  }: GetRequestArgs<DataType>): PipelineStage[] {
    const pipeline: PipelineStage[] = [this.matchingPipeline(_filters)];

    if (_embed) {
      pipeline.push(
        ...this.embeddingPipeline<DataType>(
          _embed as Exclude<GetRequestArgs<DataType>['_embed'], undefined>
        )
      );
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

    return pipeline;
  }

  public countingPipeline(queries: GetRequestArgs, pipelines?: PipelineStage[]): PipelineStage[] {
    if (!pipelines) {
      pipelines = this.generate(queries);
    }

    pipelines.push({ $count: 'total' });

    return pipelines;
  }

  public pickingFieldsPipeline(_select: Exclude<GetRequestArgs['_select'], undefined>) {
    const handler = () => {
      return _select.split(' ').reduce((acc, select) => {
        const isExclude = select.startsWith('-');
        const fieldKey = isExclude ? select.slice(1) : select;

        acc[fieldKey] = isExclude ? 0 : 1;

        return acc;
      }, {} as Record<string, number>);
    };

    return { $project: handler() };
  }

  public paginatingPipeline(
    _page: Exclude<GetRequestArgs['_page'], undefined>,
    _limit: Exclude<GetRequestArgs['_limit'], undefined>
  ) {
    return { $skip: (_page - 1) * _limit };
  }

  public sortingPipeline(_sort: Exclude<GetRequestArgs['_sort'], undefined>) {
    const sort = Object.entries(_sort).reduce((acc, [key, value]) => {
      acc[key] = value === 'asc' ? 1 : -1;
      return acc;
    }, {} as any);

    return { $sort: sort };
  }

  public matchingPipeline(filter: FilterQuery<Record<string, unknown>>) {
    return { $match: this.translateToMongoQuery(filter) };
  }

  public embeddingPipeline<DataType>(
    _embed: Exclude<GetRequestArgs<DataType>['_embed'], undefined>
  ): PipelineStage[] {
    const handler = (embedment: typeof _embed, prefixLocalField = ''): PipelineStage[] => {
      const pipelines: PipelineStage[] = [];

      const embeds: Embed[] =
        typeof embedment === 'string'
          ? [{ path: embedment }]
          : Array.isArray(embedment)
          ? embedment
          : [embedment];

      for (let i = 0; i < embeds.length; i++) {
        const embed = embeds[i];
        /** Keep track of parent field. */
        const localField = prefixLocalField ? `${prefixLocalField}.${embed.path}` : embed.path;
        const lookupPipelines: PipelineStage.Lookup['$lookup']['pipeline'] = [];

        if (embed.match) {
          lookupPipelines.push(this.matchingPipeline(embed.match));
        }

        if (embed.select) {
          lookupPipelines.push(this.pickingFieldsPipeline(embed.select));
        }

        pipelines.push({
          $lookup: {
            from: this.fieldMap?.[embed.path] ?? embed.path,
            localField: localField,
            foreignField: '_id',
            pipeline: lookupPipelines,
            as: localField,
          },
        });

        if (embed.match || embed.populate) {
          if (this.fieldTypeReferences?.[embed.path]) {
            // Make sure the array field is not empty
            pipelines.push({
              $match: {
                [`${localField}.0`]: {
                  $exists: true,
                },
              },
            });
          } else {
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
          pipelines.push(...handler(embed.populate as typeof _embed, localField));
        }
      }
      return pipelines;
    };

    return handler(_embed);
  }
}
