import produce, {
    castDraft, Draft,
} from 'immer';
import {
    VideoInfo,
} from '@moderepo/mode-apis';
import {
    BaseAction,
} from '@moderepo/mode-data-state-base';
import {
    SetVideosAction, VideosActionType, ClearVideosAction,
} from './actions';
import {
    HomeVideosState,
} from './models';


const videosByThumbnailReducer = (
    currentState: HomeVideosState['videosByThumbnailByHomeIdBySmartModuleId'], action: BaseAction,
): HomeVideosState['videosByThumbnailByHomeIdBySmartModuleId'] => {
    const { type } = action;

    switch (type) {
        case VideosActionType.SET_VIDEOS:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetVideosAction;
                const temp = draft[actualAction.homeId] || {
                };
                draft[actualAction.homeId] = temp;

                const temp2 = temp[actualAction.smartModuleId] || {
                };
                temp[actualAction.smartModuleId] = temp2;

                actualAction.videos.forEach((video: VideoInfo) => {
                    temp2[video.thumbnail] = video;
                });
            });

        default:
            return currentState;
    }
};



const videoKeysByHomeIdBySmartModuleIdBySearchParamsReducer = (
    currentState: HomeVideosState['videoKeysByHomeIdBySmartModuleIdBySearchParams'], action: BaseAction,
): HomeVideosState['videoKeysByHomeIdBySmartModuleIdBySearchParams'] => {

    const { type } = action;

    switch (type) {
        case VideosActionType.SET_VIDEOS:

            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetVideosAction;
                const temp = draft[actualAction.homeId] || {
                };
                draft[actualAction.homeId] = temp;
                
                const temp2 = temp[actualAction.smartModuleId] || {
                };
                temp[actualAction.smartModuleId] = temp2;

                temp2[actualAction.searchParams] = castDraft(
                    actualAction.videos.map((video: VideoInfo) => {
                        return video.thumbnail;
                    }),
                );
            });

        case VideosActionType.CLEAR_VIDEOS:
            // To clear videos, we just need to clear all data for the specified projectId
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as ClearVideosAction;
                if (draft[actualAction.homeId]) {
                    delete draft[actualAction.homeId]?.[actualAction.smartModuleId];
                }
            });


        default:
            return currentState;
    }
};



export const homeVideosStateReducer = (currentState: HomeVideosState, action: BaseAction): HomeVideosState => {
    return produce(currentState, (draft: Draft<HomeVideosState>) => {
        draft.videosByThumbnailByHomeIdBySmartModuleId = videosByThumbnailReducer(currentState.videosByThumbnailByHomeIdBySmartModuleId, action);
        draft.videoKeysByHomeIdBySmartModuleIdBySearchParams = castDraft(videoKeysByHomeIdBySmartModuleIdBySearchParamsReducer(
            currentState.videoKeysByHomeIdBySmartModuleIdBySearchParams, action,
        ));
    });
};
