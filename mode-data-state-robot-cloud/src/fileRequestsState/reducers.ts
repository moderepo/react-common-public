import produce, {
    castDraft, Draft,
} from 'immer';
import {
    FileRequest,
} from '@moderepo/mode-apis';
import {
    BaseAction,
} from '@moderepo/mode-data-state-base';
import {
    FileRequestStateActionType, SetFileRequestsAction, SetFileRequestAction, ClearFileRequestsAction,
} from './actions';
import {
    FileRequestsState,
} from './models';



const fileRequestsByIdByHomeIdReducer = (
    currentState: FileRequestsState['fileRequestsByIdByHomeId'], action: BaseAction,
): FileRequestsState['fileRequestsByIdByHomeId'] => {
    const { type } = action;

    switch (type) {
        case FileRequestStateActionType.SET_FILE_REQUESTS:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetFileRequestsAction;
                const { fileRequests } = actualAction;

                fileRequests.items.forEach((fileRequest: FileRequest) => {
                    const temp = draft[fileRequest.homeId] || {
                    };
                    draft[fileRequest.homeId] = temp;

                    temp[fileRequest.id] = castDraft(fileRequest);
                });
            });

        case FileRequestStateActionType.SET_FILE_REQUEST:
            // When a fileRequest is updated, we need to update the associated fileRequest in the map of fileRequests by id
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetFileRequestAction;
                const temp = draft[actualAction.fileRequest.homeId] || {
                };
                draft[actualAction.fileRequest.homeId] = temp;

                temp[actualAction.fileRequest.id] = castDraft(actualAction.fileRequest);
            });

        default:
            return currentState;
    }
};



const fileRequestIdsByHomeIdReducer = (
    currentState: FileRequestsState['fileRequestIdsByHomeId'], action: BaseAction,
): FileRequestsState['fileRequestIdsByHomeId'] => {

    const { type } = action;

    switch (type) {
        case FileRequestStateActionType.SET_FILE_REQUESTS:

            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetFileRequestsAction;

                // actualAction.fileRequests contains the complete fileRequest data. However, we only need to save the list of fileRequest IDs
                const temp = draft[actualAction.homeId] || {
                };
                draft[actualAction.homeId] = temp;


                // actualAction.fileRequests contains the complete fileRequests data.
                // However, we only need to save the list of [homeId, fileRequest.id] pairs
                temp[actualAction.searchParams] = {
                    range: actualAction.fileRequests.range,
                    items: actualAction.fileRequests.items.map((fileRequest: FileRequest) => {
                        return [fileRequest.homeId, fileRequest.id];
                    }),
                };
            });

        case FileRequestStateActionType.CLEAR_FILE_REQUESTS:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as ClearFileRequestsAction;
                delete draft[actualAction.homeId];
            });


        default:
            return currentState;
    }
};



export const fileRequestsStateReducer = (currentState: FileRequestsState, action: BaseAction): FileRequestsState => {
    return produce(currentState, (draft: Draft<FileRequestsState>) => {
        draft.fileRequestsByIdByHomeId = castDraft(fileRequestsByIdByHomeIdReducer(currentState.fileRequestsByIdByHomeId, action));
        draft.fileRequestIdsByHomeId = castDraft(fileRequestIdsByHomeIdReducer(currentState.fileRequestIdsByHomeId, action));
    });
};
