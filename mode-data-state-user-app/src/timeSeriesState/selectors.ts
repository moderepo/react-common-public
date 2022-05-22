import {
    TimeSeriesAggregation, TimeSeriesCollectionData, TimeSeriesCollectionInfo, TimeSeriesCollectionRange, TimeSeriesCollectionRawData, TimeSeriesData,
    TimeSeriesInfo, TimeSeriesRange, TimeSeriesRawData,
} from '@moderepo/mode-apis';
import {
    searchParamsToString,
} from '@moderepo/mode-data-state-base';
import {
    createCachedSelector,
} from 're-reselect';
import {
    UserAppDataState,
} from '../model';
import {
    TimeSeriesState,
} from './models';



/**
 * This is the actual function that will get the data from the state and return the data requested. However, this function returns a new
 * object every time which can cause an infinite loop in re-rendering if used in React component. Therefore this function is not EXPORTED
 * and we will create another function below which use memoize to cache the result.
 */
const selectAllHomeTimeSeriesFunc = (
    tsIdsByHomeIdByTSDBModuleId: TimeSeriesState['tsIdsByHomeIdByTSDBModuleId'],
    tsInfoByIdByHomeIdByTSDBModuleId: TimeSeriesState['tsInfoByIdByHomeIdByTSDBModuleId'],
    homeId: number,
    tsdbModuleId: string,
): readonly TimeSeriesInfo[] | undefined => {
    return tsIdsByHomeIdByTSDBModuleId[homeId]?.[tsdbModuleId]?.reduce((
        result: readonly TimeSeriesInfo[], seriesId: string,
    ) => {
        const info = tsInfoByIdByHomeIdByTSDBModuleId[homeId]?.[tsdbModuleId]?.[seriesId];
        if (info) {
            return [...result, info];
        }
        return result;
    }, []);
};



/**
 * Select time series by homeId and tsdb module id
 * @params dataState
 * @param array of [home, robotId] pairs
 */
export const selectAllHomeTimeSeries = createCachedSelector(
    (state: UserAppDataState) => { return state.timeSeriesState.tsIdsByHomeIdByTSDBModuleId; },
    (state: UserAppDataState) => { return state.timeSeriesState.tsInfoByIdByHomeIdByTSDBModuleId; },
    (state: UserAppDataState, homeId: number) => { return homeId; },
    (state: UserAppDataState, homeId: number, tsdbModuleId: string) => { return tsdbModuleId; },
    selectAllHomeTimeSeriesFunc,
)((state: UserAppDataState, homeId: number, tsdbModuleId: string) => {
    // use homeId and tsdbModuleId as cache key
    return `${homeId}:${tsdbModuleId}`;
});



/**
 * Get the time series info for the given seriesId
 * @param state
 * @param homeId
 * @param tsdbModuleId
 * @param seriesId
 */
export const selectTimeSeriesInfo = (
    state: UserAppDataState, homeId: number, tsdbModuleId: string, seriesId: string,
): TimeSeriesInfo | undefined => {
    return state.timeSeriesState.tsInfoByIdByHomeIdByTSDBModuleId?.[homeId]?.[tsdbModuleId]?.[seriesId];
};

/**
 * Get the time series range for the given seriesId
 * @param state
 * @param homeId
 * @param tsdbModuleId
 * @param seriesId
 */
export const selectTimeSeriesRange = (
    state: UserAppDataState, homeId: number, tsdbModuleId: string, seriesId: string,
): TimeSeriesRange | undefined => {
    return state.timeSeriesState.tsRangeByIdByHomeIdByTSDBModuleId?.[homeId]?.[tsdbModuleId]?.[seriesId];
};

/**
 * Get the time series data for the given seriesId and the params used when fetching the data
 * @param state
 * @param homeId
 * @param tsdbModuleId
 * @param seriesId
 */
export const selectTimeSeriesData = (
    state: UserAppDataState, homeId: number, tsdbModuleId: string, seriesId: string, startTime: string, endTime: string, aggr?: TimeSeriesAggregation,
): TimeSeriesData | undefined => {
    const searchParams = searchParamsToString({
        startTime, endTime, aggr,
    });
    return state.timeSeriesState.tsDataByIdByHomeIdByTSDBModuleIdBySearchParams?.[homeId]?.[tsdbModuleId]?.[seriesId]?.[searchParams];
};



/**
 * Get the time series raw data for the given seriesId and the params used when fetching the data
 * @param state
 * @param homeId
 * @param tsdbModuleId
 * @param seriesId
 */
export const selectTimeSeriesRawData = (
    state: UserAppDataState, homeId: number, tsdbModuleId: string, seriesId: string,
    timestamp: string, limit: number,
): TimeSeriesRawData | undefined => {
    const searchParams = searchParamsToString({
        timestamp, limit,
    });
    return state.timeSeriesState.tsRawDataByIdByHomeIdByTSDBModuleIdBySearchParams
        ?.[homeId]?.[tsdbModuleId]?.[seriesId]?.[searchParams];
};



/**
 * This is the actual function that will get the data from the state and return the data requested. However, this function returns a new
 * object every time which can cause an infinite loop in re-rendering if used in React component. Therefore this function is not EXPORTED
 * and we will create another function below which use memoize to cache the result.
 */
const selectAllHomeTimeSeriesCollectionInfoFunc = (
    tsCollectionIdsByHomeIdByTSDBModuleId: TimeSeriesState['tsCollectionIdsByHomeIdByTSDBModuleId'],
    tsCollectionInfoByIdByHomeIdByTSDBModuleId: TimeSeriesState['tsCollectionInfoByIdByHomeIdByTSDBModuleId'],
    homeId: number,
    tsdbModuleId: string,
): readonly TimeSeriesCollectionInfo[] | undefined => {
    return tsCollectionIdsByHomeIdByTSDBModuleId[homeId]?.[tsdbModuleId]?.reduce((
        result: readonly TimeSeriesCollectionInfo[], seriesId: string,
    ) => {
        const info = tsCollectionInfoByIdByHomeIdByTSDBModuleId[homeId]?.[tsdbModuleId]?.[seriesId];
        if (info) {
            return [...result, info];
        }
        return result;
    }, []);
};
    


/**
 * Select robots' health status for a list of robot ids
 * @params dataState
 * @param array of [home, robotId] pairs
 */
export const selectAllHomeTimeSeriesCollectionInfo = createCachedSelector(
    (state: UserAppDataState) => { return state.timeSeriesState.tsCollectionIdsByHomeIdByTSDBModuleId; },
    (state: UserAppDataState) => { return state.timeSeriesState.tsCollectionInfoByIdByHomeIdByTSDBModuleId; },
    (state: UserAppDataState, homeId: number) => { return homeId; },
    (state: UserAppDataState, homeId: number, tsdbModuleId: string) => { return tsdbModuleId; },
    selectAllHomeTimeSeriesCollectionInfoFunc,
)((state: UserAppDataState, homeId: number, tsdbModuleId: string) => {
    // use homeId and tsdbModuleId as cache key
    return `${homeId}:${tsdbModuleId}`;
});
    


/**
 * Get the time series info for the given collectionId
 * @param state
 * @param homeId
 * @param tsdbModuleId
 * @param seriesId
 */
export const selectTimeSeriesCollectionInfo = (
    state: UserAppDataState, homeId: number, tsdbModuleId: string, collectionId: string,
): TimeSeriesCollectionInfo | undefined => {
    return state.timeSeriesState.tsCollectionInfoByIdByHomeIdByTSDBModuleId?.[homeId]?.[tsdbModuleId]?.[collectionId];
};

/**
 * Get the time series collection range for the given collectionId
 * @param state
 * @param homeId
 * @param tsdbModuleId
 * @param seriesId
 */
export const selectTimeSeriesCollectionRange = (
    state: UserAppDataState, homeId: number, tsdbModuleId: string, collectionId: string,
): TimeSeriesCollectionRange | undefined => {
    return state.timeSeriesState.tsCollectionRangeByIdByHomeIdByTSDBModuleId?.[homeId]?.[tsdbModuleId]?.[collectionId];
};

/**
 * Get the time series collection data for the given collectionId and the params used when fetching the data
 * @param state
 * @param homeId
 * @param tsdbModuleId
 * @param collectionId
 */
export const selectTimeSeriesCollectionData = (
    state: UserAppDataState, homeId: number, tsdbModuleId: string, collectionId: string,
    startTime: string, endTime: string, selectedValues: readonly string[], aggr?: TimeSeriesAggregation,
): TimeSeriesCollectionData | undefined => {
    const searchParams = searchParamsToString({
        startTime, endTime, selectedValues: [...selectedValues].sort().join(','), aggr,
    });
    return state.timeSeriesState.tsCollectionDataByIdByHomeIdByTSDBModuleIdBySearchParams?.[homeId]?.[tsdbModuleId]?.[collectionId]?.[searchParams];
};


/**
 * Get the time series collection raw data for the given collectionId and the params used when fetching the data
 * @param state
 * @param homeId
 * @param tsdbModuleId
 * @param collectionId
 */
export const selectTimeSeriesCollectionRawData = (
    state: UserAppDataState, homeId: number, tsdbModuleId: string, collectionId: string,
    timestamp: string, limit: number, selectedValues: readonly string[], selectedTags: readonly string[],
): TimeSeriesCollectionRawData | undefined => {
    const searchParams = searchParamsToString({
        timestamp, limit, selectedValues: [...selectedValues].sort().join(','), selectedTags: [...selectedTags].sort().join(','),
    });
    return state.timeSeriesState.tsCollectionRawDataByIdByHomeIdByTSDBModuleIdBySearchParams
        ?.[homeId]?.[tsdbModuleId]?.[collectionId]?.[searchParams];
};
