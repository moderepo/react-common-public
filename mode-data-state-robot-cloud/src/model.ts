import {
    FileRequestsState,
} from './fileRequestsState';
import {
    MonitorsAndIssuesState,
} from './monitorsAndIssuesState';
import {
    RobotCloudState,
} from './robotCloudState';


/**
 * This is the interface of the Robot Cloud global data state. It consists of many individual sub states.
 * Each sub state will have its own directory where the models, actions, selectors, and reducers
 * are defined.
 */
export interface RCDataState {
    readonly rcMonitorsAndIssues: MonitorsAndIssuesState;
    readonly robotCloud: RobotCloudState;
    readonly fileRequests: FileRequestsState;
}
