import {
    AppAPI, SmartModule,
} from '@moderepo/mode-apis';
import {
    BaseAction, ExtDispatch,
} from '@moderepo/mode-data-state-base';
import {
    UserAppDataStateAction, UserAppThunkAction,
} from '../actions';


/**
 * The types of action that can be dispatched to update this sub state.
 */
export enum HomeSmartModulesActionType {
    SET_HOME_SMART_MODULES = 'set home smart modules',
    SET_HOME_SMART_MODULE = 'set home smart module',
}


/**
 * The Action interface for setting a list of modules that belonged to a home
 * @param type - The action type
 * @param modules - The array of home modules
 */
export interface SetHomeSmartModulesAction extends BaseAction {
    readonly type: HomeSmartModulesActionType.SET_HOME_SMART_MODULES;
    readonly homeId: number;
    readonly modules: readonly SmartModule[];
}


/**
 * The Action interface for setting a home module that belonged to a home.
 * @param type - The action type
 * @param module - The module
 */
export interface SetHomeSmartModuleAction extends BaseAction {
    readonly type: HomeSmartModulesActionType.SET_HOME_SMART_MODULE;
    readonly homeId: number;
    readonly module: SmartModule;
}



export const setHomeSmartModules = (homeId: number, modules: readonly SmartModule[]): SetHomeSmartModulesAction => {
    return {
        type: HomeSmartModulesActionType.SET_HOME_SMART_MODULES,
        homeId,
        modules,
    };
};



/**
 * Fetch a home smart modules
 * @param homeId - The home id
 * @param suppressError - Whether or not to throw error when it occur, default is false, throw error. This API will throw an error when a project
 *                        does not have SmartModule setup which might not a big deal in some cases. Sometime we can just treat it as an EMPTY
 *                        smart modules list instead. So if the caller doesn't want to throw error, it can pass 'true' to suppress errors and provide
 *                        default value to return if error occurs
 * @param defaultValue - The value to return if error occurs and suppressError is true..
 */
export const fetchAllHomeSmartModules = (homeId: number, suppressError: boolean = false, defaultValue: SmartModule[] = []): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        try {
            const smartModules = await AppAPI.getInstance().getAllHomeSmartModules(homeId);
            await dataDispatch(setHomeSmartModules(homeId, smartModules));
        } catch (error) {
            if (suppressError) {
                // If suppressError, use the defaultValue as result.
                await dataDispatch(setHomeSmartModules(homeId, defaultValue));
            }
            throw error;
        }
    };
};
