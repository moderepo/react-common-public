import {
    SortOrder, AppAPI, VideoInfo,
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
 * Fetch videos for a home
 */
export const fetchHomeVideos = (
    homeId: number,
    smartModuleId: string,
    pageNumber: number,
    pageSize: number,
    filters?: {
        readonly searchKeys?: string;
        readonly searchKeyPrefix?: string;
        readonly sortBy?: string;
        readonly sortOrder?: SortOrder;
    },
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        const response = await AppAPI.getInstance().getHomeVideos(homeId, smartModuleId, {
            ...filters,
            skip : pageSize * pageNumber,
            limit: pageSize,
        });
        await dataDispatch(setHomeVideos(homeId, smartModuleId, response, searchParamsToString({
            pageNumber, pageSize, ...filters,
        })));
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
