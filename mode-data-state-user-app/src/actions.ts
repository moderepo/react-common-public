import {
    BatchActionsAction, ExtDispatch,
} from '@moderepo/mode-data-state-base';
import {
    ClearProjectHomesAction, ClearUserHomesAction, SetProjectHomesAction, SetHomeAction, SetUserHomesAction,
} from './homesState';
import {
    AuthenticatingAction, AuthenticateSuccessAction, AuthenticateFailureAction, SetLoginInfoAction, UpdateLoggedInUserAction, LogoutUserAction,
} from './authState';
import {
    SetDeviceKVStoresAction, SetDeviceKVStoreAction, RemoveDeviceKVStoreAction, ClearDeviceKVStoresAction,
} from './deviceKVStoresState';
import {
    SetHomeDevicesAction, SetHomeDeviceAction, ClearHomeDevicesAction,
} from './homeDevicesState';
import {
    SetHomeKVStoreAction, ClearHomeKVStoresAction, SetHomeKVStoresAction, RemoveHomeKVStoreAction,
} from './homeKVStoresState';
import {
    SetHomeMemberAction, ClearHomeMembersAction, SetHomeMembersAction,
} from './homeMembersState';
import {
    SetHomeSmartModuleAction, SetHomeSmartModulesAction,
} from './homeSmartModulesState';
import {
    SetVideosAction, ClearVideosAction,
} from './homeVideosState';
import {
    SetTimeSeriesDataAction, SetTimeSeriesInfoAction, SetTimeSeriesRangeAction, SetAllTimeSeriesInfoAction, SetAllTimeSeriesCollectionInfoAction,
    SetTimeSeriesCollectionDataAction, SetTimeSeriesCollectionInfoAction, SetTimeSeriesCollectionRangeAction, SetTimeSeriesCollectionRawDataAction,
    SetTimeSeriesRawDataAction, ClearTimeSeriesAction, ClearTimeSeriesDataAction, ClearTimeSeriesCollectionsAction,
    ClearTimeSeriesCollectionDataAction,
} from './timeSeriesState';
import {
    ClearEntitiesAction, ClearEntityClassesAction, SetEntitiesAction, SetEntityAction, SetEntityClassAction, SetEntityClassesAction,
} from './entitiesState';
import {
    SetDeviceConfigSchemasAction,
} from './deviceConfigSchemasState';
import {
    SetAlertRulesAction, SetAlertRuleAction, ClearAlertRulesAction, SetAlertsAction, SetAlertAction, ClearAlertsAction,
} from './alertingState';
import {
    SetEventLogsDataAction, ClearEventLogsDataAction,
} from './eventLogsState';


// Re-export actions defined in each individual sub state
export * from './authState/actions';
export * from './homesState/actions';
export * from './homeMembersState/actions';
export * from './homeDevicesState/actions';
export * from './homeKVStoresState/actions';
export * from './homeSmartModulesState/actions';
export * from './deviceKVStoresState/actions';
export * from './timeSeriesState/actions';
export * from './homeVideosState/actions';
export * from './deviceConfigSchemasState/actions';



type UserAppDataStateSyncAction =
    // Auth actions
    | AuthenticatingAction
    | AuthenticateSuccessAction
    | AuthenticateFailureAction
    | SetLoginInfoAction
    | UpdateLoggedInUserAction
    | LogoutUserAction
    // DeviceKV actions
    | SetDeviceKVStoresAction
    | SetDeviceKVStoreAction
    | RemoveDeviceKVStoreAction
    | ClearDeviceKVStoresAction
    // Home actions
    | SetUserHomesAction
    | SetProjectHomesAction
    | SetHomeAction
    | ClearUserHomesAction
    | ClearProjectHomesAction
    // HomeDevice actions
    | SetHomeDevicesAction
    | SetHomeDeviceAction
    | ClearHomeDevicesAction
    // Home KV actions
    | SetHomeKVStoresAction
    | SetHomeKVStoreAction
    | RemoveHomeKVStoreAction
    | ClearHomeKVStoresAction
    // HomeMember actions
    | SetHomeMembersAction
    | SetHomeMemberAction
    | ClearHomeMembersAction
    // Home SmartModule actions
    | SetHomeSmartModulesAction
    | SetHomeSmartModuleAction
    // Video actions
    | SetVideosAction
    | ClearVideosAction
    // Time Series actions
    | SetAllTimeSeriesInfoAction
    | SetTimeSeriesInfoAction
    | SetTimeSeriesRangeAction
    | SetTimeSeriesDataAction
    | SetTimeSeriesRawDataAction
    | SetAllTimeSeriesCollectionInfoAction
    | SetTimeSeriesCollectionInfoAction
    | SetTimeSeriesCollectionRangeAction
    | SetTimeSeriesCollectionDataAction
    | SetTimeSeriesCollectionRawDataAction
    | ClearTimeSeriesAction
    | ClearTimeSeriesDataAction
    | ClearTimeSeriesCollectionsAction
    | ClearTimeSeriesCollectionDataAction
    // Entity actions
    | SetEntityClassesAction
    | SetEntityClassAction
    | SetEntitiesAction
    | SetEntityAction
    | ClearEntitiesAction
    | ClearEntityClassesAction
    // Device Config Schema actions
    | SetDeviceConfigSchemasAction
    // Alerting actions
    | SetAlertRulesAction
    | SetAlertRuleAction
    | ClearAlertRulesAction
    | SetAlertsAction
    | SetAlertAction
    | ClearAlertsAction
    // Event Logs actions
    | SetEventLogsDataAction
    | ClearEventLogsDataAction
    // Other actions
    | BatchActionsAction
;


// Define a ThunkAction for Mode App so that we can have stricter type check when someone call dispatch(thunkAction);
// This will enforce dataDispatch to only allow UserAppThunkAction action but not other thunk actions.
export type UserAppThunkAction = (dispatch: ExtDispatch<UserAppDataStateSyncAction | UserAppThunkAction>)=> Promise<void>;

// Combine Mode App sync actions with the thunk action so that we can just refer to it as 1 type without having to do | all the time.
export type UserAppDataStateAction = UserAppDataStateSyncAction | UserAppThunkAction;
