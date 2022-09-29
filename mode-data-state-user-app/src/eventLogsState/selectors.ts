import {
    EventLogData,
} from '@moderepo/mode-apis';
import {
    searchParamsToString,
} from '@moderepo/mode-data-state-base';
import {
    UIFetchEventLogFilter,
} from '.';
import {
    UserAppDataState,
} from '../model';



/**
 * Get the event logs data for the given homeId, logSourcePath, and filters used when fetching the data
 * @param state
 * @param homeId
 * @param logSourcePath
 * @param filters
 */
export const selectEventLogs = (
    state: UserAppDataState,
    homeId: number,
    logSourcePath: string,
    filters: UIFetchEventLogFilter,
): EventLogData | undefined => {
    const searchParams = searchParamsToString(filters);
    return state.eventLogsState.eventLogDataByHomeIdByLogResourcePathBySearchParams[homeId]?.[logSourcePath]?.[searchParams];
};
