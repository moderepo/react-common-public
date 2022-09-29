import {
    createContext,
} from 'react';
import {
    ExtDispatch,
} from '@moderepo/mode-data-state-base';
import {
    initialTimeSeriesState,
} from './timeSeriesState/models';
import {
    initialHomeVideosState,
} from './homeVideosState';
import {
    initialAuthState,
} from './authState';
import {
    initialHomesState,
} from './homesState';
import {
    initialHomeMembersState,
} from './homeMembersState';
import {
    initialHomeDevicesState,
} from './homeDevicesState';
import {
    initialHomeKVStoresState,
} from './homeKVStoresState';
import {
    initialHomeSmartModulesState,
} from './homeSmartModulesState';
import {
    initialDeviceKVStoresState,
} from './deviceKVStoresState';
import {
    UserAppDataState,
} from './model';
import {
    UserAppDataStateAction,
} from './actions';
import {
    initialEntitiesState,
} from './entitiesState';
import {
    initialDeviceConfigSchemasState,
} from './deviceConfigSchemasState';
import {
    initialAlertingState,
} from './alertingState';
import {
    initialEventLogsState,
} from './eventLogsState';


export interface UserAppDataContext {
    readonly state: UserAppDataState;
    readonly dispatch: ExtDispatch<UserAppDataStateAction>;
}


/**
 * Create an instance of GlobalDataState and initialize it all the initial states.
 * Most app can use this global state unless it needs custom initial state then it can creat a new initial global state
 */
export const initialUserAppDataState: UserAppDataState = {
    auth               : initialAuthState,
    homes              : initialHomesState,
    homeMembers        : initialHomeMembersState,
    homeDevices        : initialHomeDevicesState,
    homeKVStores       : initialHomeKVStoresState,
    homeSmartModules   : initialHomeSmartModulesState,
    deviceKVStores     : initialDeviceKVStoresState,
    timeSeriesState    : initialTimeSeriesState,
    homeVideosState    : initialHomeVideosState,
    entities           : initialEntitiesState,
    alerting           : initialAlertingState,
    deviceConfigSchemas: initialDeviceConfigSchemasState,
    eventLogsState     : initialEventLogsState,
};



/**
 * An instance of the GlobalDataContext. Any Component that are interested in the global data context, can use React's useContext
 * to get a reference to this context like this
 *      const {state, dispatch} = React.useContext(userAppDataContext);
 */
export const userAppDataContext = createContext<UserAppDataContext>({
    state   : initialUserAppDataState,
    dispatch: (): Promise<any> => {
        return Promise.resolve();
    },
});
