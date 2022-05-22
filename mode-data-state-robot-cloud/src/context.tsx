import {
    createContext,
} from 'react';
import {
    ExtDispatch,
} from '@moderepo/mode-data-state-base';
import {
    initialMonitorsAndIssuesState,
} from './monitorsAndIssuesState';
import {
    initialRobotCloudState,
} from './robotCloudState';
import {
    RCDataState,
} from './model';
import {
    RCDataStateAction,
} from './actions';
import {
    initialFileRequestsState,
} from './fileRequestsState';

export interface RCDataContext {
    readonly state: RCDataState;
    readonly dispatch: ExtDispatch<RCDataStateAction>;
}



/**
 * Create an instance of RCDataState and initialize it all the initial states.
 */
export const initialRCDataState: RCDataState = {
    rcMonitorsAndIssues: initialMonitorsAndIssuesState,
    robotCloud         : initialRobotCloudState,
    fileRequests       : initialFileRequestsState,
};


/**
 * An instance of the GlobalDataContext. Any Component that are interested in the global data context, can use React's useContext
 * to get a reference to this context like this
 *      const {state, dispatch} = React.useContext(rcDataContext);
 */
export const rcDataContext = createContext<RCDataContext>({
    state   : initialRCDataState,
    dispatch: (): Promise<any> => {
        return Promise.resolve();
    },
});
