import {
    SortOrder,
    VideoInfo,
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
    HomeVideosState,
} from './models';


/**
 * This is the actual function that will get the data from the state and return the data requested. However, this function returns a new
 * object every time which can cause an infinite loop in re-rendering if used in React component. Therefore this function is not EXPORTED
 * and we will create another function below which use memoize to cache the result.
 */
const selectHomeVideosFunc = (
    videosByThumbnailByHomeIdBySmartModuleId: HomeVideosState['videosByThumbnailByHomeIdBySmartModuleId'],
    videoKeysByHomeIdBySmartModuleIdBySearchParams: HomeVideosState['videoKeysByHomeIdBySmartModuleIdBySearchParams'],
    homeId: number,
    smartModuleId: string,
    searchParams: string,
): readonly VideoInfo[] |undefined => {
    const videoKeys = videoKeysByHomeIdBySmartModuleIdBySearchParams[homeId]?.[smartModuleId]?.[searchParams];

    return videoKeys?.reduce((result: readonly VideoInfo[], videoKey) => {
        const video = videosByThumbnailByHomeIdBySmartModuleId[homeId]?.[smartModuleId]?.[videoKey];
        if (video) {
            return [...result, video];
        }
        return result;
    }, []);
};


/**
 * Select all home videos for the specified homeId, smartModuleId, and filters
 */
export const selectHomeVideos = createCachedSelector(
    (state: UserAppDataState) => { return state.homeVideosState.videosByThumbnailByHomeIdBySmartModuleId; },
    (state: UserAppDataState) => { return state.homeVideosState.videoKeysByHomeIdBySmartModuleIdBySearchParams; },
    (state: UserAppDataState, homeId: number) => { return homeId; },
    (state: UserAppDataState, homeId: number, smartModuleId: string) => { return smartModuleId; },
    (state: UserAppDataState, homeId: number, smartModuleId: string, searchParams: {
        readonly pageNumber: number;
        readonly pageSize: number;
        readonly searchKeys?: string;
        readonly searchKeyPrefix?: string;
        readonly sortBy?: string;
        readonly sortOrder?: SortOrder;
    }) => { return searchParamsToString(searchParams); },
    selectHomeVideosFunc,
)((state: UserAppDataState, homeId: number, smartModuleId: string, searchParams: {
    readonly pageNumber: number;
    readonly pageSize: number;
    readonly searchKeys?: string;
    readonly searchKeyPrefix?: string;
    readonly sortBy?: string;
    readonly sortOrder?: SortOrder;
}) => {
    // use homeId, smartModuleId, and searchParams as cache key for createCachedSelector
    return `${homeId}:${smartModuleId}:${searchParamsToString(searchParams)}`;
});



export const selectHomeVideoBySearchKey = (
    state: UserAppDataState, homeId: number, smartModuleId: string, thumbnail: string,
): VideoInfo | undefined => {
    return state.homeVideosState.videosByThumbnailByHomeIdBySmartModuleId[homeId]?.[smartModuleId]?.[thumbnail];
};
