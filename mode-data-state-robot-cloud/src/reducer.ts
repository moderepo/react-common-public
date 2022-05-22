import produce, {
    castDraft, Draft,
} from 'immer';
import {
    BaseAction, BatchActionsAction, BaseActionType,
} from '@moderepo/mode-data-state-base';
import {
    RCDataState,
} from './model';
import {
    monitorsAndIssuesStateReducer,
} from './monitorsAndIssuesState';
import {
    robotCloudStateReducer,
} from './robotCloudState';
import {
    fileRequestsStateReducer,
} from './fileRequestsState';

/**
 * This is the root reducer for the Robot Cloud data state. It will be the starting point for data state reducer. It actually doesn't
 * handle any action other than the BatchAction. It will escalate all the tasks to each individual sub state
 *
 * @param currentState
 * @param action
 */
export const rcDataStateReducer = (currentState: RCDataState, action: BaseAction): RCDataState => {
    const { type } = action;

    switch (type) {
        case BaseActionType.BATCH_ACTIONS:
            return produce(currentState, () => {
                const actualAction = action as BatchActionsAction;
                return actualAction.actions.reduce((state: any, a: BaseAction): any => {
                    return rcDataStateReducer(state, a);
                }, currentState);
            });

        default:
            // Apply reducer for each individual domain.
            return produce(currentState, (draft: Draft<RCDataState>) => {
                draft.rcMonitorsAndIssues = castDraft(monitorsAndIssuesStateReducer(currentState.rcMonitorsAndIssues, action));
                draft.robotCloud = castDraft(robotCloudStateReducer(currentState.robotCloud, action));
                draft.fileRequests = castDraft(fileRequestsStateReducer(currentState.fileRequests, action));
            });
    }
};
