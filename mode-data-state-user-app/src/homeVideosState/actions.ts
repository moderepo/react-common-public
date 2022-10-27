import {
    AppAPI, VideoInfo, FetchHomeVideosFilters,
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
export enum VideosActionType {
    SET_VIDEOS = 'set videos',
    CLEAR_VIDEOS = 'clear videos',
}



/**
 * The action interface for setting a list of videos to the state
 * @param type - The action type
 * @param homeId - The id of the home the videos belonged to
 * @param videos - The list of videos object to set.
 */
export interface SetVideosAction extends BaseAction {
    readonly type: VideosActionType.SET_VIDEOS;
    readonly homeId: number;
    readonly smartModuleId: string;
    readonly videos: readonly VideoInfo[];
    readonly searchParams: string;
}



/**
 * The action interface for clearing the cached videos data
 * @param type - The action type
 */
export interface ClearVideosAction extends BaseAction {
    readonly type: VideosActionType.CLEAR_VIDEOS;
    readonly homeId: number;
    readonly smartModuleId: string;
}



export const setHomeVideos = (homeId: number, smartModuleId: string, videos: readonly VideoInfo[], searchParams: string): SetVideosAction => {
    return {
        type: VideosActionType.SET_VIDEOS,
        homeId,
        smartModuleId,
        videos,
        searchParams,
    };
};



/**
 * Create an action for clearing all the cache video for the specified home
 */
export const clearVideos = (homeId: number, smartModuleId: string): ClearVideosAction => {
    return {
        type: VideosActionType.CLEAR_VIDEOS,
        homeId,
        smartModuleId,
    };
};



/**
 * Backend uses 'limit' and 'skip' attributes however in the frontend, we use pageNumber and pageSize so this function need
 * to accept a filter object that uses pageNumber, pageSize and then convert that to skip/limit before calling the API
 */
export interface UIFetchHomeVideosFilters extends Omit<Omit<FetchHomeVideosFilters, 'skip'>, 'limit'> {
    readonly pageNumber?: number | undefined;
    readonly pageSize?: number | undefined;
}



/**
 * Fetch videos for a home
 */
export const fetchHomeVideos = (
    homeId: number,
    smartModuleId: string,
    filters?: UIFetchHomeVideosFilters | undefined,
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        const modifiedFilters = {
            ...filters,                                             // Copy the filters
            // change pageSize/pageNumber to skip/limit
            skip      : filters?.pageNumber && filters.pageSize ? filters.pageNumber * filters.pageSize : undefined,
            limit     : filters?.pageSize ? filters.pageSize : undefined,
            // exclude pageSize/pageNumber
            pageNumber: undefined,
            pageSize  : undefined,
        };

        const response = await AppAPI.getInstance().getHomeVideos(homeId, smartModuleId, modifiedFilters);
        await dataDispatch(setHomeVideos(homeId, smartModuleId, response, searchParamsToString(filters)));
    };
};



/**
 * Delete home videos for the given searchKey. NOTE: this will delete all videos that has the same searchKey
 */
export const deleteHomeVideos = (
    homeId: number,
    smartModuleId: string,
    searchKey: string,
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        await AppAPI.getInstance().deleteHomeVideos(homeId, smartModuleId, searchKey);
        await dataDispatch(clearVideos(homeId, smartModuleId));
    };
};
