import {
    TimeSeriesCollectionData, TimeSeriesCollectionInfo, TimeSeriesCollectionRange, TimeSeriesCollectionRawData, TimeSeriesData, TimeSeriesInfo,
    TimeSeriesRange,
    TimeSeriesRawData,
} from '@moderepo/mode-apis';


export interface TimeSeriesState {

    /**
     * This stores all the time series info that have been fetched and group them by homeId then group them by tsdbModuleId
     * and then group them by seriesId.
     * seriesIds are only unique within a home -> tsdbModuleId therefore we need to group them by homeId and tsdbModuleId first and . e.g.
     *      {
     *          123: {
     *              tsdb1: {
     *                  'time-series-id-1': {id: '...', moduleId: '...', timeZone: '...'}
     *                  'time-series-id-2': {id: '...', moduleId: '...', timeZone: '...'}
     *                  'time-series-id-3': {id: '...', moduleId: '...', timeZone: '...'}
     *              },
     *              tsdb2: {
     *                  'time-series-id-1': {id: '...', moduleId: '...', timeZone: '...'}
     *                  'time-series-id-2': {id: '...', moduleId: '...', timeZone: '...'}
     *                  'time-series-id-3': {id: '...', moduleId: '...', timeZone: '...'}
     *              }
     *          },
     *          456: {
     *              tsdb1: {
     *                  'time-series-id-1': {id: '...', moduleId: '...', timeZone: '...'}
     *                  'time-series-id-2': {id: '...', moduleId: '...', timeZone: '...'}
     *                  'time-series-id-3': {id: '...', moduleId: '...', timeZone: '...'}
     *                  'time-series-id-4': {id: '...', moduleId: '...', timeZone: '...'}
     *                  'time-series-id-5': {id: '...', moduleId: '...', timeZone: '...'}
     *              }
     *          }
     *      }
     */
    readonly tsInfoByIdByHomeIdByTSDBModuleId: {
        readonly [homeId: number]: {
            readonly [tsdbModuleId: string]: {
                readonly [seriesId: string]: TimeSeriesInfo | undefined;
            } | undefined;
        } | undefined;
    };

    /**
     * This stores ALL series IDs for each home and group them by homeId -> TSDBModuleId. E.g.
     *      {
     *          123: {
     *              tsdb1: ['time-series-id-1', 'time-series-id-2', 'time-series-id-3', ...],
     *              tsdb2: ['time-series-id-1', 'time-series-id-2', 'time-series-id-3', ...],
     *          },
     *          456: {
     *              tsdb: ['time-series-id-1', 'time-series-id-2', 'time-series-id-3', 'time-series-id-4', 'time-series-id-5', ...]
     *          },
     *          789: {
     *              tsdb: ['time-series-id-1', 'time-series-id-2', 'time-series-id-3', ...]
     *          }
     *      }
     * We only need to store the time series ids here, not the actual time series info. If we need to get the time series info objects for
     * these time series ids, we will look them up from the timeSeriesInfoByIdByHomeId.
     */
    readonly tsIdsByHomeIdByTSDBModuleId: {
        readonly [homeId: number]: {
            readonly [tsdbModuleId: string]: readonly string[] | undefined;
        } | undefined;
    }


    readonly tsRangeByIdByHomeIdByTSDBModuleId: {
        readonly [homeId: number]: {
            readonly [tsdbModuleId: string]: {
                readonly [seriesId: string]: TimeSeriesRange | undefined;
            } | undefined;
        } | undefined;
    };

    readonly tsDataByIdByHomeIdByTSDBModuleIdBySearchParams: {
        readonly [homeId: number]: {
            readonly [smartModuleId: string]: {
                readonly [seriesId: string]: {
                    readonly [searchParams: string]: TimeSeriesData | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
    };

    readonly tsRawDataByIdByHomeIdByTSDBModuleIdBySearchParams: {
        readonly [homeId: number]: {
            readonly [tsdbModuleId: string]: {
                readonly [seriesId: string]: {
                    readonly [searchParams: string]: TimeSeriesRawData | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
    };

    /**
     * This stores all the Collection info that have been fetched and group them by homeId and then group them by collection Id.
     * collection ids are only unique within a home therefore we need to group them by homeId first. e.g.
     *      {
     *          123: {
     *              tsdb1: {
     *                  'collection-id-1': {id: '...', moduleId: '...', timeZone: '...'}
     *                  'collection-id-2': {id: '...', moduleId: '...', timeZone: '...'}
     *                  'collection-id-3': {id: '...', moduleId: '...', timeZone: '...'}
     *              },
     *              tsdb2: {
     *                  'collection-id-1': {id: '...', moduleId: '...', timeZone: '...'}
     *                  'collection-id-2': {id: '...', moduleId: '...', timeZone: '...'}
     *                  'collection-id-3': {id: '...', moduleId: '...', timeZone: '...'}
     *              }
     *          },
     *          456: {
     *              tsdb: {
     *                  'collection-id-1': {id: '...', moduleId: '...', timeZone: '...'}
     *                  'collection-id-2': {id: '...', moduleId: '...', timeZone: '...'}
     *                  'collection-id-3': {id: '...', moduleId: '...', timeZone: '...'}
     *                  'collection-id-4': {id: '...', moduleId: '...', timeZone: '...'}
     *                  'collection-id-5': {id: '...', moduleId: '...', timeZone: '...'}
     *              }
     *          }
     *      }
     */
    readonly tsCollectionInfoByIdByHomeIdByTSDBModuleId: {
        readonly [homeId: number]: {
            readonly [tsdbModuleId: string]: {
                readonly [seriesId: string]: TimeSeriesCollectionInfo | undefined;
            } | undefined;
        } | undefined;
    };


    /**
     * This stores ALL collection IDs for each home and group them by homeId -> TSDBModuleId. E.g.
     *      {
     *          123: {
     *              tsdb1: ['collection-id-1', 'collection-id-2', 'collection-id-3', ...],
     *              tsdb2: ['collection-id-1', 'collection-id-2', 'collection-id-3', ...]
     *          },
     *          456: {
     *              tsdb: ['collection-id-1', 'collection-id-2', 'collection-id-3', 'collection-id-4', 'collection-id-5', ...]
     *          },
     *          789: {
     *              tsdb: ['collection-id-1', 'collection-id-2', 'collection-id-3', ...]
     *          }
     *      }
     * We only need to store the time series ids here, not the actual time series info. If we need to get the time series info objects for
     * these time series ids, we will look them up from the timeSeriesInfoByIdByHomeId.
     */
    readonly tsCollectionIdsByHomeIdByTSDBModuleId: {
        readonly [homeId: number]: {
            readonly [tsdbModuleId: string]: readonly string[] | undefined;
        } | undefined;
    }


    readonly tsCollectionRangeByIdByHomeIdByTSDBModuleId: {
        readonly [homeId: number]: {
            readonly [tsdbModuleId: string]: {
                readonly [collectionId: string]: TimeSeriesCollectionRange | undefined;
            } | undefined;
        } | undefined;
    };

    readonly tsCollectionDataByIdByHomeIdByTSDBModuleIdBySearchParams: {
        readonly [homeId: number]: {
            readonly [tsdbModuleId: string]: {
                readonly [searchParam: string]: {
                    readonly [collectionId: string]: TimeSeriesCollectionData | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
    };

    readonly tsCollectionRawDataByIdByHomeIdByTSDBModuleIdBySearchParams: {
        readonly [homeId: number]: {
            readonly [tsdbModuleId: string]: {
                readonly [collectionId: string]: {
                    readonly [searchParams: string]: TimeSeriesCollectionRawData | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
    };
}


export const initialTimeSeriesState: TimeSeriesState = {
    tsInfoByIdByHomeIdByTSDBModuleId: {
    },
    tsIdsByHomeIdByTSDBModuleId: {
    },
    tsRangeByIdByHomeIdByTSDBModuleId: {
    },
    tsDataByIdByHomeIdByTSDBModuleIdBySearchParams: {
    },
    tsRawDataByIdByHomeIdByTSDBModuleIdBySearchParams: {
    },
    tsCollectionInfoByIdByHomeIdByTSDBModuleId: {
    },
    tsCollectionIdsByHomeIdByTSDBModuleId: {
    },
    tsCollectionRangeByIdByHomeIdByTSDBModuleId: {
    },
    tsCollectionDataByIdByHomeIdByTSDBModuleIdBySearchParams: {
    },
    tsCollectionRawDataByIdByHomeIdByTSDBModuleIdBySearchParams: {
    },
};
