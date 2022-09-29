import {
    BaseAction,
} from '@moderepo/mode-data-state-base';
import produce, {
    castDraft, Draft,
} from 'immer';
import {
    ClearEventLogsDataAction,
} from '.';
import {
    SetEventLogsDataAction, EventLogsActionType,
} from './actions';
import {
    EventLogsState,
} from './models';



const tsDataByIdByHomeIdByTSDBModuleIdBySearchParamsReducer = (
    currentState: EventLogsState['eventLogDataByHomeIdByLogResourcePathBySearchParams'], action: BaseAction,
): EventLogsState['eventLogDataByHomeIdByLogResourcePathBySearchParams'] => {
    const { type } = action;

    switch (type) {
        case EventLogsActionType.SET_EVENT_LOGS_DATA:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetEventLogsDataAction;
                const temp = draft[actualAction.homeId] || {
                };
                draft[actualAction.homeId] = temp;
                
                const temp2 = temp[actualAction.logResourcePath] || {
                };
                temp[actualAction.logResourcePath] = temp2;
                
                temp2[actualAction.searchParams] = castDraft(
                    actualAction.data,
                );
            });

        case EventLogsActionType.CLEAR_EVENT_LOGS_DATA:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as ClearEventLogsDataAction;
                const eventLogsByHomeId = draft[actualAction.homeId];
                if (eventLogsByHomeId) {
                    eventLogsByHomeId[actualAction.logResourcePath] = {
                    };
                }
            });

        default:
            return currentState;
    }
};



export const eventLogsStateReducer = (currentState: EventLogsState, action: BaseAction): EventLogsState => {
    return produce(currentState, (draft: Draft<EventLogsState>) => {
        draft.eventLogDataByHomeIdByLogResourcePathBySearchParams = castDraft(
            tsDataByIdByHomeIdByTSDBModuleIdBySearchParamsReducer(
                currentState.eventLogDataByHomeIdByLogResourcePathBySearchParams, action,
            ),
        );
    });
};
