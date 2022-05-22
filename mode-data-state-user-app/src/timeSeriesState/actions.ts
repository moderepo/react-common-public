import {
    TimeSeriesInfo, TimeSeriesCollectionInfo, TimeSeriesRange, TimeSeriesData, TimeSeriesCollectionRange, TimeSeriesCollectionData, AppAPI,
    TimeSeriesAggregation,
    TimeSeriesCollectionRawData,
    TimeSeriesRawData,
    TimeSeriesResolution,
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



export const setAllTimeSeriesInfo = (
    homeId: number, smartModuleId: string, timeSeries: readonly TimeSeriesInfo[],
): SetAllTimeSeriesInfoAction => {
    return {
        type        : TimeSeriesActionType.SET_ALL_TIME_SERIES_INFO,
        homeId,
        tsdbModuleId: smartModuleId,
        timeSeries,
    };
};


export const setTimeSeriesInfo = (
    homeId: number, smartModuleId: string, timeSeriesId: string, timeSeries: TimeSeriesInfo | undefined,
): SetTimeSeriesInfoAction => {
    return {
        type        : TimeSeriesActionType.SET_TIME_SERIES_INFO,
        homeId,
        tsdbModuleId: smartModuleId,
        timeSeriesId,
        timeSeries,
    };
};


export const setTimeSeriesRange = (
    homeId: number, smartModuleId: string, timeSeriesId: string, range: TimeSeriesRange | undefined,
): SetTimeSeriesRangeAction => {
    return {
        type        : TimeSeriesActionType.SET_TIME_SERIES_RANGE,
        homeId,
        tsdbModuleId: smartModuleId,
        timeSeriesId,
        range,
    };
};


export const setTimeSeriesData = (
    homeId: number, smartModuleId: string, timeSeriesId: string, data: TimeSeriesData | undefined, searchParams: string,
): SetTimeSeriesDataAction => {
    return {
        type        : TimeSeriesActionType.SET_TIME_SERIES_DATA,
        homeId,
        tsdbModuleId: smartModuleId,
        timeSeriesId,
        data,
        searchParams,
    };
};


export const setTimeSeriesRawData = (
    homeId: number, smartModuleId: string, timeSeriesId: string, data: TimeSeriesRawData | undefined, searchParams: string,
): SetTimeSeriesRawDataAction => {
    return {
        type        : TimeSeriesActionType.SET_TIME_SERIES_RAW_DATA,
        homeId,
        tsdbModuleId: smartModuleId,
        timeSeriesId,
        data,
        searchParams,
    };
};


export const setAllTimeSeriesCollectionInfo = (
    homeId: number, smartModuleId: string, collections: readonly TimeSeriesCollectionInfo[],
): SetAllTimeSeriesCollectionInfoAction => {
    return {
        type        : TimeSeriesActionType.SET_ALL_TIME_SERIES_COLLECTION_INFO,
        homeId,
        tsdbModuleId: smartModuleId,
        collections,
    };
};


export const setTimeSeriesCollectionInfo = (
    homeId: number, smartModuleId: string, collectionId: string, collection: TimeSeriesCollectionInfo | undefined,
): SetTimeSeriesCollectionInfoAction => {
    return {
        type        : TimeSeriesActionType.SET_TIME_SERIES_COLLECTION_INFO,
        homeId,
        tsdbModuleId: smartModuleId,
        collectionId,
        collection,
    };
};


export const setTimeSeriesCollectionRange = (
    homeId: number, smartModuleId: string, collectionId: string, range: TimeSeriesCollectionRange | undefined,
): SetTimeSeriesCollectionRangeAction => {
    return {
        type        : TimeSeriesActionType.SET_TIME_SERIES_COLLECTION_RANGE,
        homeId,
        tsdbModuleId: smartModuleId,
        collectionId,
        range,
    };
};


export const setTimeSeriesCollectionData = (
    homeId: number, smartModuleId: string, collectionId: string, data: TimeSeriesCollectionData | undefined, searchParams: string,
): SetTimeSeriesCollectionDataAction => {
    return {
        type        : TimeSeriesActionType.SET_TIME_SERIES_COLLECTION_DATA,
        homeId,
        tsdbModuleId: smartModuleId,
        collectionId,
        data,
        searchParams,
    };
};


export const setTimeSeriesCollectionRawData = (
    homeId: number, smartModuleId: string, collectionId: string, data: TimeSeriesCollectionRawData | undefined, searchParams: string,
): SetTimeSeriesCollectionRawDataAction => {
    return {
        type        : TimeSeriesActionType.SET_TIME_SERIES_COLLECTION_RAW_DATA,
        homeId,
        tsdbModuleId: smartModuleId,
        collectionId,
        data,
        searchParams,
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
    homeId: number, smartModuleId: string, suppressError: boolean = false, defaultValue: readonly TimeSeriesInfo[] = [],
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        try {
            const response = await AppAPI.getInstance().getAllTimeSeriesInfo(homeId, smartModuleId);
            await dataDispatch(setAllTimeSeriesInfo(homeId, smartModuleId, response));
        } catch (error) {
            if (suppressError) {
                await dataDispatch(setAllTimeSeriesInfo(homeId, smartModuleId, defaultValue));
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
    homeId: number, smartModuleId: string, seriesId: string, suppressError: boolean = false, defaultValue: TimeSeriesInfo | undefined = undefined,
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        try {
            const response = await AppAPI.getInstance().getTimeSeriesInfo(homeId, smartModuleId, seriesId);
            await dataDispatch(setTimeSeriesInfo(homeId, smartModuleId, seriesId, response));
        } catch (error) {
            if (suppressError) {
                if (defaultValue) {
                    await dataDispatch(setTimeSeriesInfo(homeId, smartModuleId, seriesId, defaultValue));
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
    homeId: number, smartModuleId: string, seriesId: string,
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        const response = await AppAPI.getInstance().getTimeSeriesRange(homeId, smartModuleId, seriesId);
        await dataDispatch(setTimeSeriesRange(homeId, smartModuleId, seriesId, response));
    };
};


/**
 * Fetch time series data for a specific time series
 */
export const fetchTimeSeriesData = (
    homeId: number,
    smartModuleId: string,
    seriesId: string,
    startTime: string,
    endTime: string,
    aggr?: TimeSeriesAggregation,
    resolution?: TimeSeriesResolution,
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        const response = await AppAPI.getInstance().getTimeSeriesData(homeId, smartModuleId, seriesId, startTime, endTime, aggr, resolution);
        await dataDispatch(setTimeSeriesData(homeId, smartModuleId, seriesId, response, searchParamsToString({
            startTime, endTime, aggr, resolution,
        })));
    };
};

/**
 * Fetch time series RAW data for a specific time series
 */
export const fetchTimeSeriesRawData = (
    homeId: number,
    smartModuleId: string,
    seriesId: string,
    timestamp: string,
    limit: number,
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        const response = await AppAPI.getInstance().getTimeSeriesRawData(
            homeId, smartModuleId, seriesId, timestamp, limit,
        );
        await dataDispatch(setTimeSeriesRawData(homeId, smartModuleId, seriesId, response, searchParamsToString({
            timestamp, limit,
        })));
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
    homeId: number, smartModuleId: string, suppressError: boolean = false, defaultValue: TimeSeriesCollectionInfo[] = [],
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        try {
            const response = await AppAPI.getInstance().getAllTimeSeriesCollectionInfo(homeId, smartModuleId);
            await dataDispatch(setAllTimeSeriesCollectionInfo(homeId, smartModuleId, response));
        } catch (error) {
            if (suppressError) {
                await dataDispatch(setAllTimeSeriesCollectionInfo(homeId, smartModuleId, defaultValue));
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
    homeId: number, smartModuleId: string, collectionId: string, suppressError: boolean = false,
    defaultValue: TimeSeriesCollectionInfo | undefined = undefined,
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        try {
            const response = await AppAPI.getInstance().getTimeSeriesCollectionInfo(homeId, smartModuleId, collectionId);
            await dataDispatch(setTimeSeriesCollectionInfo(homeId, smartModuleId, collectionId, response));
        } catch (error) {
            if (suppressError) {
                if (defaultValue) {
                    dataDispatch(setTimeSeriesCollectionInfo(homeId, smartModuleId, collectionId, defaultValue));
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
    homeId: number, smartModuleId: string, collectionId: string,
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        const response = await AppAPI.getInstance().getTimeSeriesCollectionRange(homeId, smartModuleId, collectionId);
        await dataDispatch(setTimeSeriesCollectionRange(homeId, smartModuleId, collectionId, response));
    };
};


/**
 * Fetch time series collection data does a specific time series collection
 */
export const fetchTimeSeriesCollectionData = (
    homeId: number,
    smartModuleId: string,
    collectionId: string,
    startTime: string,
    endTime: string,
    selectedValues: readonly string[],
    aggr?: TimeSeriesAggregation,
    resolution?: TimeSeriesResolution,
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        const response = await AppAPI.getInstance().getTimeSeriesCollectionData(
            homeId, smartModuleId, collectionId, startTime, endTime, selectedValues, aggr, resolution,
        );
        await dataDispatch(setTimeSeriesCollectionData(homeId, smartModuleId, collectionId, response, searchParamsToString({
            startTime, endTime, selectedValues: [...selectedValues].sort().join(','), aggr, resolution,
        })));
        // TODO - Add result to state
    };
};

/**
 * Fetch time series collection data does a specific time series collection
 */
export const fetchTimeSeriesCollectionRawData = (
    homeId: number,
    smartModuleId: string,
    collectionId: string,
    timestamp: string,
    limit: number,
    selectedValues: readonly string[],
    selectedTags: readonly string[],
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        const response = await AppAPI.getInstance().getTimeSeriesCollectionRawData(
            homeId, smartModuleId, collectionId, timestamp, limit, selectedValues, selectedTags,
        );
        await dataDispatch(setTimeSeriesCollectionRawData(homeId, smartModuleId, collectionId, response, searchParamsToString({
            timestamp, limit, selectedValues: [...selectedValues].sort().join(','), selectedTags: [...selectedTags].sort().join(','),
        })));
    };
};
