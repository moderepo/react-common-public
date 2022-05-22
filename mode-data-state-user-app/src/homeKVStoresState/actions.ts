import {
    AppAPI, KeyValuePair,
} from '@moderepo/mode-apis';
import {
    BaseAction, searchParamsToString, ExtDispatch,
} from '@moderepo/mode-data-state-base';
import {
    UserAppDataStateAction, UserAppThunkAction,
} from '../actions';



/**
 * The types of action that can be dispatched to update this sub state.
 */
export enum HomeKVStoresActionType {
    SET_HOME_KV_STORES = 'set home kv stores',
    SET_HOME_KV_STORE = 'set home kv store',
    REMOVE_HOME_KV_STORE = 'remove home kv store',
    CLEAR_HOME_KV_STORES = 'clear home kv stores',
}



/**
 * The Action interface for setting a list of devices that belonged to a home
 * @param type - The action type
 * @param searchParams
 */
export interface SetHomeKVStoresAction extends BaseAction {
    readonly type: HomeKVStoresActionType.SET_HOME_KV_STORES;
    readonly homeId: number;
    readonly kvStores: readonly KeyValuePair[];
    readonly searchParams: string;
}


/**
 * The Action interface for setting a KV store that belonged to a home.
 * @param type - The action type
 * @param kvStore - The kvStore
 */
export interface SetHomeKVStoreAction extends BaseAction {
    readonly type: HomeKVStoresActionType.SET_HOME_KV_STORE;
    readonly homeId: number;
    readonly kvStore: KeyValuePair;
}


/**
 * The Action interface for deleting a kv store that belonged to a home.
 * @param type - The action type
 * @param key - The kvStore key
 */
export interface RemoveHomeKVStoreAction extends BaseAction {
    readonly type: HomeKVStoresActionType.REMOVE_HOME_KV_STORE;
    readonly homeId: number;
    readonly key: string;
}


/**
 * The Action interface for clearing the list of devices that belonged to a home
 * @param type - The action type
 */
export interface ClearHomeKVStoresAction extends BaseAction {
    readonly type: HomeKVStoresActionType.CLEAR_HOME_KV_STORES;
    readonly homeId: number;
}


export const setHomeKVStores = (homeId: number, kvStores: readonly KeyValuePair[], searchParams: string): SetHomeKVStoresAction => {
    return {
        type: HomeKVStoresActionType.SET_HOME_KV_STORES,
        homeId,
        kvStores,
        searchParams,
    };
};



export const setHomeKVStore = (homeId: number, kvStore: KeyValuePair): SetHomeKVStoreAction => {
    return {
        type: HomeKVStoresActionType.SET_HOME_KV_STORE,
        homeId,
        kvStore,
    };
};



export const removeHomeKVStore = (homeId: number, key: string): RemoveHomeKVStoreAction => {
    return {
        type: HomeKVStoresActionType.REMOVE_HOME_KV_STORE,
        homeId,
        key,
    };
};


export const clearHomeKVStores = (homeId: number): ClearHomeKVStoresAction => {
    return {
        type: HomeKVStoresActionType.CLEAR_HOME_KV_STORES,
        homeId,
    };
};


/**
 * Fetch all key/value pairs for a given device
 */
export const fetchAllHomeKVStores = (homeId: number, keyPrefix?: string): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        const keyValuePairs = await AppAPI.getInstance().getAllHomeKeyValuePairs(homeId, keyPrefix);
        await dataDispatch(setHomeKVStores(homeId, keyValuePairs, searchParamsToString({
            keyPrefix,
        })));
    };
};


/**
 * Fetch a home's key/value pair
 */
export const fetchHomeKVStore = (homeId: number, key: string): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        const keyValuePair = await AppAPI.getInstance().getHomeKeyValuePair(homeId, key);
        await dataDispatch(setHomeKVStore(homeId, keyValuePair));
    };
};


/**
 * Update a home's key value pair
 * @param homeId - The id of the home which we want to update
 * @param key - The key of the KV pair we want to update
 * @param value - The new value of the key value pair
 */
export const updateHomeKVStore = (
    homeId: number, key: string, value: any,
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        await AppAPI.getInstance().updateHomeKeyValuePair(homeId, key, value);
        // Home KV updated, we need to reload the data
        await dataDispatch(fetchHomeKVStore(homeId, key));
    };
};


/**
 * Delete a home's key value pair
 * @param homeId - The id of the home which we want to delete
 * @param key - The key of the KV pair we want to delete
 */
export const createHomeKVStore = (
    homeId: number, key: string, value?: any,
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        await AppAPI.getInstance().createHomeKeyValuePair(homeId, key, value);
        // KV store added so we need to clear the cached list of home's KV stores
        await dataDispatch(clearHomeKVStores(homeId));
    };
};


/**
 * Delete a home's key value pair
 * @param homeId - The id of the home which we want to delete
 * @param key - The key of the KV pair we want to delete
 */
export const deleteHomeKVStore = (
    homeId: number, key: string,
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        await AppAPI.getInstance().deleteHomeKeyValuePair(homeId, key);
        // KV store is deleted so we need to clear the cached list of home's KV stores
        await dataDispatch(clearHomeKVStores(homeId));
        await dataDispatch(removeHomeKVStore(homeId, key));
    };
};
