import {
    BatchActionsAction, ExtDispatch,
} from '@moderepo/mode-data-state-base';
import {
    ClearFileRequestsAction, SetFileRequestsAction, SetFileRequestAction,
} from './fileRequestsState';
import {
    SetMonitorAction, SetIssueAction, SetMonitorsAction, SetIssuesAction, ClearMonitorsAction, ClearIssuesAction, SetIssueCommentAction,
    SetIssueCommentsAction, ClearIssueCommentsAction,
} from './monitorsAndIssuesState';
import {
    SetRobotAction, SetRobotsAction, ClearRobotsAction, SetRobotStatusAction, SetRobotCatalogAction, SetProjectGatewayCatalogAction,
    SetRobotCloudProjectSettingsAction,
} from './robotCloudState';


// Re-export actions defined in each individual sub state
export * from './monitorsAndIssuesState/actions';
export * from './robotCloudState/actions';
export * from './fileRequestsState/actions';


type RCDataStateSyncAction =
    // Alert and Issues state actions
    | SetMonitorAction
    | SetIssueAction
    | SetMonitorsAction
    | SetIssuesAction
    | ClearMonitorsAction
    | ClearIssuesAction
    | SetIssueCommentAction
    | SetIssueCommentsAction
    | ClearIssueCommentsAction
    // robot cloud state actions
    | SetRobotAction
    | SetRobotsAction
    | ClearRobotsAction
    | SetRobotStatusAction
    | SetRobotCatalogAction
    | SetProjectGatewayCatalogAction
    | SetRobotCloudProjectSettingsAction
    | BatchActionsAction
    // File Request state actions
    | SetFileRequestAction
    | SetFileRequestsAction
    | ClearFileRequestsAction
    ;



// Define a ThunkAction for Mode App so that we can have stricter type check when someone call dataDispatch(thunkAction);
// This will enforce dataDispatch to only allow RitzThunkAction action but not other thunk actions.
export type RCThunkAction = (dataDispatch: ExtDispatch<RCDataStateSyncAction | RCThunkAction>)=> Promise<void>;

// Combine Mode App sync actions with the thunk action so that we can just refer to it as 1 type without having to do | all the time.
export type RCDataStateAction = RCDataStateSyncAction | RCThunkAction;
