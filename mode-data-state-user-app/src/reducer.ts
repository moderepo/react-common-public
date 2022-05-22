import produce, {
    castDraft, Draft,
} from 'immer';
import {
    BaseActionType, BaseAction, BatchActionsAction,
} from '@moderepo/mode-data-state-base';
import {
    authStateReducer,
} from './authState/reducers';
import {
    homesStateReducer,
} from './homesState/reducers';
import {
    homeMembersStateReducer,
} from './homeMembersState/reducers';
import {
    homeDevicesStateReducer,
} from './homeDevicesState/reducers';
import {
    homeKVStoresStateReducer,
} from './homeKVStoresState/reducers';
import {
    homeSmartModulesStateReducer,
} from './homeSmartModulesState/reducers';
import {
    deviceKVStoresStateReducer,
} from './deviceKVStoresState/reducers';
import {
    UserAppDataState,
} from './model';
import {
    homeVideosStateReducer,
} from './homeVideosState/reducers';
import {
    timeSeriesStateReducer,
} from './timeSeriesState/reducers';
import {
    entitiesStateReducer,
} from './entitiesState/reducers';
import {
    deviceConfigSchemasStateReducer,
} from './deviceConfigSchemasState/reducers';


/**
 * This is the root reducer for the MODE app data state. It will be the starting point for data state reducer. It actually doesn't
 * handle any action. It will escalate all the tasks to each individual sub state
 *
 * @param currentState
 * @param action
 */
export const userAppDataStateReducer = (currentState: UserAppDataState, action: BaseAction): UserAppDataState => {
    const { type } = action;

    switch (type) {
        case BaseActionType.BATCH_ACTIONS:
            return produce(currentState, () => {
                const actualAction = action as BatchActionsAction;
                return actualAction.actions.reduce((state: any, a: BaseAction): any => {
                    return userAppDataStateReducer(state, a);
                }, currentState);
            });

        default:
            // Apply reducer for each individual domain.
            return produce(currentState, (draft: Draft<UserAppDataState>) => {
                draft.auth = authStateReducer(currentState.auth, action);
                draft.homes = castDraft(homesStateReducer(currentState.homes, action));
                draft.homeMembers = castDraft(homeMembersStateReducer(currentState.homeMembers, action));
                draft.homeDevices = castDraft(homeDevicesStateReducer(currentState.homeDevices, action));
                draft.homeKVStores = castDraft(homeKVStoresStateReducer(currentState.homeKVStores, action));
                draft.homeSmartModules = castDraft(homeSmartModulesStateReducer(currentState.homeSmartModules, action));
                draft.deviceKVStores = castDraft(deviceKVStoresStateReducer(currentState.deviceKVStores, action));
                draft.timeSeriesState = castDraft(timeSeriesStateReducer(currentState.timeSeriesState, action));
                draft.homeVideosState = castDraft(homeVideosStateReducer(currentState.homeVideosState, action));
                draft.entities = castDraft(entitiesStateReducer(currentState.entities, action));
                draft.deviceConfigSchemas = castDraft(deviceConfigSchemasStateReducer(currentState.deviceConfigSchemas, action));
            });
    }
};
