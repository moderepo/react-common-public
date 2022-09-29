import {
    GetEventLogFilter, ModeAppProxyAPI, EventLogData,
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
export enum EventLogsActionType {
    SET_EVENT_LOGS_DATA = 'set event logs data',
    CLEAR_EVENT_LOGS_DATA = 'clear event logs data',
}

export interface SetEventLogsDataAction extends BaseAction {
    readonly type: EventLogsActionType.SET_EVENT_LOGS_DATA;
    readonly homeId: number;
    readonly logResourcePath: string;
    readonly data: EventLogData | undefined;
    readonly searchParams: string;
}


export interface ClearEventLogsDataAction extends BaseAction {
    readonly type: EventLogsActionType.CLEAR_EVENT_LOGS_DATA;
    readonly homeId: number;
    readonly logResourcePath: string;
}


export const setEventLogsData = (
    homeId: number,
    logResourcePath: string,
    data: EventLogData | undefined,
    searchParams: string,
): SetEventLogsDataAction => {
    return {
        type: EventLogsActionType.SET_EVENT_LOGS_DATA,
        homeId,
        logResourcePath,
        data,
        searchParams,
    };
};



export const clearEventLogsData = (homeId: number, logResourcePath: string): ClearEventLogsDataAction => {
    return {
        type: EventLogsActionType.CLEAR_EVENT_LOGS_DATA,
        homeId,
        logResourcePath,
    };
};


/**
 * The fetch alerts filter options used by the UI which uses pageNumber and pageSize instead of skip and limit.
 * These will be converted to skip/limit before we make the API call
 */
export interface UIFetchEventLogFilter extends Omit<Omit<GetEventLogFilter, 'skip'>, 'limit'> {
    readonly pageNumber?: number | undefined;
    readonly pageSize?: number | undefined;
}



/**
 * Fetch event logs data for a specific homeId, logResourcePath, and filters
 */
export const fetchEventLogs = (
    homeId: number,
    logSourcePath: string,
    filters: UIFetchEventLogFilter,
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        const modifiedFilters = {
            ...filters,                                             // Copy the filters
            // change pageSize/pageNumber to skip/limit
            skip      : filters?.pageNumber !== undefined && filters?.pageSize !== undefined ? filters.pageNumber * filters.pageSize : undefined,
            limit     : filters?.pageSize !== undefined ? filters.pageSize : undefined,
            // exclude pageSize/pageNumber
            pageNumber: undefined,
            pageSize  : undefined,
        };

        const response = await ModeAppProxyAPI.getInstance().getEventLog(homeId, logSourcePath, modifiedFilters);
        await dataDispatch(setEventLogsData(homeId, logSourcePath, response, searchParamsToString(filters)));
    };
};
