import {
    PaginationDataSet, FileRequest, FetchFileRequestFilters,
} from '@moderepo/mode-apis';
import {
    searchParamsToString,
} from '@moderepo/mode-data-state-base';
import createCachedSelector from 're-reselect';
import {
    RCDataState,
} from '../model';
import {
    FileRequestsState,
} from './models';



/**
 * This is the actual function that will get the data from the state and return the data requested. However, this function returns a new
 * object every time which can cause an infinite loop in re-rendering if used in React component. Therefore this function is not EXPORTED
 * and we will create another function below which use memoize to cache the result.
 */
const selectFileRequestsFunc = (
    fileRequestsByIdByHomeId: FileRequestsState['fileRequestsByIdByHomeId'],
    fileRequestIdsByHomeId: FileRequestsState['fileRequestIdsByHomeId'],
    homeId: number | undefined,
    searchParams: string,
): PaginationDataSet<FileRequest> | undefined => {
    if (homeId) {
        const dataSet = fileRequestIdsByHomeId[homeId]?.[searchParams];

        // This will return a new PaginationDataSet of FileRequest which can cause infinite loop if we don't use memoize
        if (dataSet) {
            return {
                range: dataSet.range,
                items: dataSet.items.reduce((result: readonly FileRequest[], [homeId, requestId]: [homeId:number, requestId:number]) => {
                    const fileRequest = fileRequestsByIdByHomeId[homeId]?.[requestId];
                    if (fileRequest) {
                        return [...result, fileRequest];
                    }
                    return result;
                }, []),
            };
        }
    }
    
    return undefined;
};



/**
 * This is the public function that components should use to get the cached FileRequests data.
 * @param state - The data state
 * @param homeId - The home id the FileRequests belonged to
 * @param filters - The filter options e.g. limit, skip, deviceId, homeId, etc...
 */
export const selectAllFileRequests = createCachedSelector(
    (state: RCDataState) => { return state.fileRequests.fileRequestsByIdByHomeId; },
    (state: RCDataState) => { return state.fileRequests.fileRequestIdsByHomeId; },
    (state: RCDataState, homeId: number | undefined) => { return homeId; },
    (state: RCDataState, homeId: number | undefined, filters: FetchFileRequestFilters) => {
        return searchParamsToString(filters);
    },
    selectFileRequestsFunc,
)((state: RCDataState, homeId: number | undefined, filters: FetchFileRequestFilters) => {
    return searchParamsToString(filters);
});



/**
 * Get fileRequest by its id. We will look up the fileRequest from the state's fileRequestsById map
 * @param state
 * @param homeId - The id of the home the fileRequest belonged to. fileRequestId is unique per home BUT not per project therefore we need to
 *                 know the homeId
 * @param requestId
 */
export const selectFileRequestById = (state: RCDataState, homeId: number | undefined, requestId: number | undefined): FileRequest | undefined => {
    if (requestId && homeId) {
        return state.fileRequests.fileRequestsByIdByHomeId[homeId]?.[requestId];
    }
    return undefined;
};
