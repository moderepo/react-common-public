import {
    TimeSeriesInfo, TimeSeriesCollectionInfo, TimeSeriesRange, TimeSeriesData, TimeSeriesCollectionRange, TimeSeriesCollectionData, AppAPI,
    TimeSeriesAggregation, TimeSeriesCollectionRawData, TimeSeriesRawData, TimeSeriesResolution,
} from '@moderepo/mode-apis';
import {
    BaseAction, ExtDispatch, searchParamsToString,
} from '@moderepo/mode-data-state-base';
import {
    UserAppDataStateAction, UserAppThunkAction,
} from '../actions';


/**
 * The types of action that can be dispatched to update this sub state.
 */
export enum TimeSeriesActionType {
    SET_ALL_TIME_SERIES_INFO = 'set all time series info',
    SET_TIME_SERIES_INFO = 'set time series info',
    SET_TIME_SERIES_RANGE = 'set time series range',
    SET_TIME_SERIES_DATA = 'set time series data',
    SET_TIME_SERIES_RAW_DATA = 'set time series raw data',
    SET_ALL_TIME_SERIES_COLLECTION_INFO = 'set all home time series collection info',
    SET_TIME_SERIES_COLLECTION_INFO = 'set time series collection info',
    SET_TIME_SERIES_COLLECTION_RANGE = 'set time series collection range',
    SET_TIME_SERIES_COLLECTION_DATA = 'set time series collection data',
    SET_TIME_SERIES_COLLECTION_RAW_DATA = 'set time series collection raw data',
    CLEAR_TIME_SERIES = 'clear all time series',
    CLEAR_TIME_SERIES_DATA = 'clear time series data',
    CLEAR_TIME_SERIES_COLLECTION = 'clear all collections',
    CLEAR_TIME_SERIES_COLLECTION_DATA = 'clear collections data',
}


export interface SetAllTimeSeriesInfoAction extends BaseAction {
    readonly type: TimeSeriesActionType.SET_ALL_TIME_SERIES_INFO;
    readonly homeId: number;
    readonly tsdbModuleId: string;
    readonly timeSeries: readonly TimeSeriesInfo[];
}


export interface SetTimeSeriesInfoAction extends BaseAction {
    readonly type: TimeSeriesActionType.SET_TIME_SERIES_INFO;
    readonly homeId: number;
    readonly tsdbModuleId: string;
    readonly timeSeriesId: string;
    readonly timeSeries: TimeSeriesInfo | undefined;
}

export interface SetTimeSeriesRangeAction extends BaseAction {
    readonly type: TimeSeriesActionType.SET_TIME_SERIES_RANGE;
    readonly homeId: number;
    readonly tsdbModuleId: string;
    readonly timeSeriesId: string;
    readonly range: TimeSeriesRange | undefined;
}

export interface SetTimeSeriesDataAction extends BaseAction {
    readonly type: TimeSeriesActionType.SET_TIME_SERIES_DATA;
    readonly homeId: number;
    readonly tsdbModuleId: string;
    readonly timeSeriesId: string;
    readonly data: TimeSeriesData | undefined;
    readonly searchParams: string;
}

export interface SetTimeSeriesRawDataAction extends BaseAction {
    readonly type: TimeSeriesActionType.SET_TIME_SERIES_RAW_DATA;
    readonly homeId: number;
    readonly tsdbModuleId: string;
    readonly timeSeriesId: string;
    readonly data: TimeSeriesRawData | undefined;
    readonly searchParams: string;
}


export interface SetAllTimeSeriesCollectionInfoAction extends BaseAction {
    readonly type: TimeSeriesActionType.SET_ALL_TIME_SERIES_COLLECTION_INFO;
    readonly homeId: number;
    readonly tsdbModuleId: string;
    readonly collections: readonly TimeSeriesCollectionInfo[];
}


export interface SetTimeSeriesCollectionInfoAction extends BaseAction {
    readonly type: TimeSeriesActionType.SET_TIME_SERIES_COLLECTION_INFO;
    readonly homeId: number;
    readonly tsdbModuleId: string;
    readonly collectionId: string;
    readonly collection: TimeSeriesCollectionInfo | undefined;
}

export interface SetTimeSeriesCollectionRangeAction extends BaseAction {
    readonly type: TimeSeriesActionType.SET_TIME_SERIES_COLLECTION_RANGE;
    readonly homeId: number;
    readonly tsdbModuleId: string;
    readonly collectionId: string;
    readonly range: TimeSeriesCollectionRange | undefined;
}

export interface SetTimeSeriesCollectionDataAction extends BaseAction {
    readonly type: TimeSeriesActionType.SET_TIME_SERIES_COLLECTION_DATA;
    readonly homeId: number;
    readonly tsdbModuleId: string;
    readonly collectionId: string;
    readonly data: TimeSeriesCollectionData | undefined;
    readonly searchParams: string;
}


export interface SetTimeSeriesCollectionRawDataAction extends BaseAction {
    readonly type: TimeSeriesActionType.SET_TIME_SERIES_COLLECTION_RAW_DATA;
    readonly homeId: number;
    readonly tsdbModuleId: string;
    readonly collectionId: string;
    readonly data: TimeSeriesCollectionRawData | undefined;
    readonly searchParams: string;
}


export interface ClearTimeSeriesAction extends BaseAction {
    readonly type: TimeSeriesActionType.CLEAR_TIME_SERIES;
    readonly homeId: number;
    readonly tsdbModuleId: string;
}

export interface ClearTimeSeriesDataAction extends BaseAction {
    readonly type: TimeSeriesActionType.CLEAR_TIME_SERIES_DATA;
    readonly homeId: number;
    readonly tsdbModuleId: string;
    readonly timeSeriesId: string;
}


export interface ClearTimeSeriesCollectionsAction extends BaseAction {
    readonly type: TimeSeriesActionType.CLEAR_TIME_SERIES_COLLECTION;
    readonly homeId: number;
    readonly tsdbModuleId: string;
}

export interface ClearTimeSeriesCollectionDataAction extends BaseAction {
    readonly type: TimeSeriesActionType.CLEAR_TIME_SERIES_COLLECTION_DATA;
    readonly homeId: number;
    readonly tsdbModuleId: string;
    readonly collectionId: string;
}


export const setAllTimeSeriesInfo = (
    homeId: number, tsdbModuleId: string, timeSeries: readonly TimeSeriesInfo[],
): SetAllTimeSeriesInfoAction => {
    return {
        type: TimeSeriesActionType.SET_ALL_TIME_SERIES_INFO,
        homeId,
        tsdbModuleId,
        timeSeries,
    };
};


export const setTimeSeriesInfo = (
    homeId: number, tsdbModuleId: string, timeSeriesId: string, timeSeries: TimeSeriesInfo | undefined,
): SetTimeSeriesInfoAction => {
    return {
        type: TimeSeriesActionType.SET_TIME_SERIES_INFO,
        homeId,
        tsdbModuleId,
        timeSeriesId,
        timeSeries,
    };
};


export const setTimeSeriesRange = (
    homeId: number, tsdbModuleId: string, timeSeriesId: string, range: TimeSeriesRange | undefined,
): SetTimeSeriesRangeAction => {
    return {
        type: TimeSeriesActionType.SET_TIME_SERIES_RANGE,
        homeId,
        tsdbModuleId,
        timeSeriesId,
        range,
    };
};


export const setTimeSeriesData = (
    homeId: number, tsdbModuleId: string, timeSeriesId: string, data: TimeSeriesData | undefined, searchParams: string,
): SetTimeSeriesDataAction => {
    return {
        type: TimeSeriesActionType.SET_TIME_SERIES_DATA,
        homeId,
        tsdbModuleId,
        timeSeriesId,
        data,
        searchParams,
    };
};


export const setTimeSeriesRawData = (
    homeId: number, tsdbModuleId: string, timeSeriesId: string, data: TimeSeriesRawData | undefined, searchParams: string,
): SetTimeSeriesRawDataAction => {
    return {
        type: TimeSeriesActionType.SET_TIME_SERIES_RAW_DATA,
        homeId,
        tsdbModuleId,
        timeSeriesId,
        data,
        searchParams,
    };
};


export const clearTimeSeries = (
    homeId: number, tsdbModuleId: string,
): ClearTimeSeriesAction => {
    return {
        type: TimeSeriesActionType.CLEAR_TIME_SERIES,
        homeId,
        tsdbModuleId,
    };
};


export const clearTimeSeriesData = (
    homeId: number, tsdbModuleId: string, timeSeriesId: string,
): ClearTimeSeriesDataAction => {
    return {
        type: TimeSeriesActionType.CLEAR_TIME_SERIES_DATA,
        homeId,
        tsdbModuleId,
        timeSeriesId,
    };
};



export const setAllTimeSeriesCollectionInfo = (
    homeId: number, tsdbModuleId: string, collections: readonly TimeSeriesCollectionInfo[],
): SetAllTimeSeriesCollectionInfoAction => {
    return {
        type: TimeSeriesActionType.SET_ALL_TIME_SERIES_COLLECTION_INFO,
        homeId,
        tsdbModuleId,
        collections,
    };
};


export const setTimeSeriesCollectionInfo = (
    homeId: number, tsdbModuleId: string, collectionId: string, collection: TimeSeriesCollectionInfo | undefined,
): SetTimeSeriesCollectionInfoAction => {
    return {
        type: TimeSeriesActionType.SET_TIME_SERIES_COLLECTION_INFO,
        homeId,
        tsdbModuleId,
        collectionId,
        collection,
    };
};


export const setTimeSeriesCollectionRange = (
    homeId: number, tsdbModuleId: string, collectionId: string, range: TimeSeriesCollectionRange | undefined,
): SetTimeSeriesCollectionRangeAction => {
    return {
        type: TimeSeriesActionType.SET_TIME_SERIES_COLLECTION_RANGE,
        homeId,
        tsdbModuleId,
        collectionId,
        range,
    };
};


export const setTimeSeriesCollectionData = (
    homeId: number, tsdbModuleId: string, collectionId: string, data: TimeSeriesCollectionData | undefined, searchParams: string,
): SetTimeSeriesCollectionDataAction => {
    return {
        type: TimeSeriesActionType.SET_TIME_SERIES_COLLECTION_DATA,
        homeId,
        tsdbModuleId,
        collectionId,
        data,
        searchParams,
    };
};


export const setTimeSeriesCollectionRawData = (
    homeId: number, tsdbModuleId: string, collectionId: string, data: TimeSeriesCollectionRawData | undefined, searchParams: string,
): SetTimeSeriesCollectionRawDataAction => {
    return {
        type: TimeSeriesActionType.SET_TIME_SERIES_COLLECTION_RAW_DATA,
        homeId,
        tsdbModuleId,
        collectionId,
        data,
        searchParams,
    };
};


export const clearTimeSeriesCollection = (
    homeId: number, tsdbModuleId: string,
): ClearTimeSeriesCollectionsAction => {
    return {
        type: TimeSeriesActionType.CLEAR_TIME_SERIES_COLLECTION,
        homeId,
        tsdbModuleId,
    };
};


export const clearTimeSeriesCollectionData = (
    homeId: number, tsdbModuleId: string, collectionId: string,
): ClearTimeSeriesCollectionDataAction => {
    return {
        type: TimeSeriesActionType.CLEAR_TIME_SERIES_COLLECTION_DATA,
        homeId,
        tsdbModuleId,
        collectionId,
    };
};



/**
 * Fetch a home time series info
 * @param defaultValue - The default value to add to the global state if the API call failed. When we fetch time series info, we don't know if
 * it exist so it is possible that the call will fail. However, for this API call, it is OK to fail. If the call fail, we can assume the data
 * doesn't exist and can continue. Therefore, the caller has an option to provide defaultValue to use if the API call fail. If the API call failed,
 * we will use the defaultValue and put it in the global data state.
 */
export const fetchAllTimeSeriesInfo = (
    homeId: number, tsdbModuleId: string, suppressError: boolean = false, defaultValue: readonly TimeSeriesInfo[] = [],
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        try {
            const response = await AppAPI.getInstance().getAllTimeSeriesInfo(homeId, tsdbModuleId);
            await dataDispatch(setAllTimeSeriesInfo(homeId, tsdbModuleId, response));
        } catch (error) {
            if (suppressError) {
                await dataDispatch(setAllTimeSeriesInfo(homeId, tsdbModuleId, defaultValue));
            } else {
                throw error;
            }
        }
    };
};


/**
 * Fetch time series info for a specific series
 * @param defaultValue - The default value to add to the global state if the API call failed. When we fetch time series info, we don't know if
 * it exist so it is possible that the call will fail. However, for this API call, it is OK to fail. If the call fail, we can assume the data
 * doesn't exist and can continue. Therefore, the caller has an option to provide defaultValue to use if the API call fail. If the API call failed,
 * we will use the defaultValue and put it in the global data state.
 */
export const fetchTimeSeriesInfo = (
    homeId: number, tsdbModuleId: string, seriesId: string, suppressError: boolean = false, defaultValue: TimeSeriesInfo | undefined = undefined,
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        try {
            const response = await AppAPI.getInstance().getTimeSeriesInfo(homeId, tsdbModuleId, seriesId);
            await dataDispatch(setTimeSeriesInfo(homeId, tsdbModuleId, seriesId, response));
        } catch (error) {
            if (suppressError) {
                if (defaultValue) {
                    await dataDispatch(setTimeSeriesInfo(homeId, tsdbModuleId, seriesId, defaultValue));
                }
            } else {
                throw error;
            }

        }
    };
};


/**
 * Fetch time series range for a specific time series
 */
export const fetchTimeSeriesRange = (
    homeId: number, tsdbModuleId: string, seriesId: string,
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        const response = await AppAPI.getInstance().getTimeSeriesRange(homeId, tsdbModuleId, seriesId);
        await dataDispatch(setTimeSeriesRange(homeId, tsdbModuleId, seriesId, response));
    };
};


/**
 * Fetch time series data for a specific time series
 */
export const fetchTimeSeriesData = (
    homeId: number,
    tsdbModuleId: string,
    seriesId: string,
    startTime: string,
    endTime: string,
    aggr?: TimeSeriesAggregation,
    resolution?: TimeSeriesResolution,
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        const response = await AppAPI.getInstance().getTimeSeriesData(homeId, tsdbModuleId, seriesId, startTime, endTime, aggr, resolution);
        await dataDispatch(setTimeSeriesData(homeId, tsdbModuleId, seriesId, response, searchParamsToString({
            startTime, endTime, aggr, resolution,
        })));
    };
};

/**
 * Fetch time series RAW data for a specific time series
 */
export const fetchTimeSeriesRawData = (
    homeId: number,
    tsdbModuleId: string,
    seriesId: string,
    timestamp: string,
    limit: number,
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        const response = await AppAPI.getInstance().getTimeSeriesRawData(
            homeId, tsdbModuleId, seriesId, timestamp, limit,
        );
        await dataDispatch(setTimeSeriesRawData(homeId, tsdbModuleId, seriesId, response, searchParamsToString({
            timestamp, limit,
        })));
    };
};


/**
 * Delete a time series
 */
export const deleteTimeSeries = (
    homeId: number,
    tsdbModuleId: string,
    timeSeriesId: string,
    projectApiKey?: string,
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        await AppAPI.getInstance().deleteTimeSeries(homeId, tsdbModuleId, timeSeriesId, projectApiKey);

        // Need to clear the time series because the list of time series changed
        await dataDispatch(clearTimeSeries(homeId, tsdbModuleId));
    };
};


/**
 * Delete a time series data
 */
export const deleteTimeSeriesData = (
    homeId: number,
    tsdbModuleId: string,
    timeSeriesId: string,
    begin: string,
    end: string,
    projectApiKey?: string,
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        await AppAPI.getInstance().deleteTimeSeriesData(homeId, tsdbModuleId, timeSeriesId, begin, end, projectApiKey);

        // Need to clear the time series data because the data for this time series data changed
        await dataDispatch(clearTimeSeriesData(homeId, tsdbModuleId, timeSeriesId));
    };
};



/**
 * Fetch a home time series Collection info.
 * @param defaultValue - The default value to add to the global state if the API call failed. When we fetch collection info, we don't know if
 * it exist so it is possible that the call will fail. However, for this API call, it is OK to fail. If the call fail, we can assume the data
 * doesn't exist and can continue. Therefore, the caller has an option to provide defaultValue to use if the API call fail. If the API call failed,
 * we will use the defaultValue and put it in the global data state.
 */
export const fetchAllTimeSeriesCollectionInfo = (
    homeId: number, tsdbModuleId: string, suppressError: boolean = false, defaultValue: TimeSeriesCollectionInfo[] = [],
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        try {
            const response = await AppAPI.getInstance().getAllTimeSeriesCollectionInfo(homeId, tsdbModuleId);
            await dataDispatch(setAllTimeSeriesCollectionInfo(homeId, tsdbModuleId, response));
        } catch (error) {
            if (suppressError) {
                await dataDispatch(setAllTimeSeriesCollectionInfo(homeId, tsdbModuleId, defaultValue));
            } else {
                throw error;
            }
        }
    };
};


/**
 * Fetch time series Collection info for a specific series
 * @param defaultValue - The default value to add to the global state if the API call failed. When we fetch collection info, we don't know if
 * it exist so it is possible that the call will fail. However, for this API call, it is OK to fail. If the call fail, we can assume the data
 * doesn't exist and can continue. Therefore, the caller has an option to provide defaultValue to use if the API call fail. If the API call failed,
 * we will use the defaultValue and put it in the global data state.
 */
export const fetchTimeSeriesCollectionInfo = (
    homeId: number, tsdbModuleId: string, collectionId: string, suppressError: boolean = false,
    defaultValue: TimeSeriesCollectionInfo | undefined = undefined,
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        try {
            const response = await AppAPI.getInstance().getTimeSeriesCollectionInfo(homeId, tsdbModuleId, collectionId);
            await dataDispatch(setTimeSeriesCollectionInfo(homeId, tsdbModuleId, collectionId, response));
        } catch (error) {
            if (suppressError) {
                if (defaultValue) {
                    dataDispatch(setTimeSeriesCollectionInfo(homeId, tsdbModuleId, collectionId, defaultValue));
                }
            } else {
                throw error;
            }
        }
    };
};


/**
 * Fetch time series collection range for a specific time series collection
 */
export const fetchTimeSeriesCollectionRange = (
    homeId: number, tsdbModuleId: string, collectionId: string,
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        const response = await AppAPI.getInstance().getTimeSeriesCollectionRange(homeId, tsdbModuleId, collectionId);
        await dataDispatch(setTimeSeriesCollectionRange(homeId, tsdbModuleId, collectionId, response));
    };
};


/**
 * Fetch time series collection data does a specific time series collection
 */
export const fetchTimeSeriesCollectionData = (
    homeId: number,
    tsdbModuleId: string,
    collectionId: string,
    startTime: string,
    endTime: string,
    selectedValues: readonly string[],
    aggr?: TimeSeriesAggregation,
    resolution?: TimeSeriesResolution,
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        const response = await AppAPI.getInstance().getTimeSeriesCollectionData(
            homeId, tsdbModuleId, collectionId, startTime, endTime, selectedValues, aggr, resolution,
        );
        await dataDispatch(setTimeSeriesCollectionData(homeId, tsdbModuleId, collectionId, response, searchParamsToString({
            startTime, endTime, selectedValues: [...selectedValues].sort().join(','), aggr, resolution,
        })));
    };
};

/**
 * Fetch time series collection data does a specific time series collection
 */
export const fetchTimeSeriesCollectionRawData = (
    homeId: number,
    tsdbModuleId: string,
    collectionId: string,
    timestamp: string,
    limit: number,
    selectedValues: readonly string[],
    selectedTags: readonly string[],
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        const response = await AppAPI.getInstance().getTimeSeriesCollectionRawData(
            homeId, tsdbModuleId, collectionId, timestamp, limit, selectedValues, selectedTags,
        );
        await dataDispatch(setTimeSeriesCollectionRawData(homeId, tsdbModuleId, collectionId, response, searchParamsToString({
            timestamp, limit, selectedValues: [...selectedValues].sort().join(','), selectedTags: [...selectedTags].sort().join(','),
        })));
    };
};



/**
 * Delete a time series collection
 */
export const deleteTimeSeriesCollection = (
    homeId: number,
    tsdbModuleId: string,
    collectionId: string,
    projectApiKey?: string,
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        await AppAPI.getInstance().deleteTimeSeriesCollection(homeId, tsdbModuleId, collectionId, projectApiKey);

        // Need to clear the time series collection because the list of time series collection changed
        await dataDispatch(clearTimeSeriesCollection(homeId, tsdbModuleId));
    };
};


/**
 * Delete a time series collection data
 */
export const deleteTimeSeriesCollectionData = (
    homeId: number,
    tsdbModuleId: string,
    collectionId: string,
    begin: string,
    end: string,
    projectApiKey?: string,
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        await AppAPI.getInstance().deleteTimeSeriesCollectionData(homeId, tsdbModuleId, collectionId, begin, end, projectApiKey);
        
        // Need to clear the time series collection data because the data for this time series collection data changed
        await dataDispatch(clearTimeSeriesCollectionData(homeId, tsdbModuleId, collectionId));
    };
};
