import {
    AuthState,
} from './authState';
import {
    DeviceKVStoresState,
} from './deviceKVStoresState';
import {
    EntitiesState,
} from './entitiesState';
import {
    HomeDevicesState,
} from './homeDevicesState';
import {
    HomeKVStoresState,
} from './homeKVStoresState';
import {
    HomeMembersState,
} from './homeMembersState';
import {
    HomeSmartModulesState,
} from './homeSmartModulesState';
import {
    HomesState,
} from './homesState';
import {
    HomeVideosState,
} from './homeVideosState';
import {
    TimeSeriesState,
} from './timeSeriesState';
import {
    DeviceConfigSchemasState,
} from './deviceConfigSchemasState';
import {
    AlertingState,
} from './alertingState';
import {
    EventLogsState,
} from './eventLogsState';

/**
 * UserAppDataState is a Global data state used for managing MODE end-user app data.
 */
export interface UserAppDataState {
    readonly auth: AuthState;
    readonly homes: HomesState;
    readonly homeMembers: HomeMembersState;
    readonly homeDevices: HomeDevicesState;
    readonly homeKVStores: HomeKVStoresState;
    readonly homeSmartModules: HomeSmartModulesState;
    readonly deviceKVStores: DeviceKVStoresState;
    readonly timeSeriesState: TimeSeriesState;
    readonly homeVideosState: HomeVideosState;
    readonly entities: EntitiesState;
    readonly alerting: AlertingState;
    readonly deviceConfigSchemas: DeviceConfigSchemasState;
    readonly eventLogsState: EventLogsState;
}
