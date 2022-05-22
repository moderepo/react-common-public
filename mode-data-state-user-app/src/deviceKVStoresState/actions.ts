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
export enum DeviceKVStoresActionType {
    SET_DEVICE_KV_STORES = 'set device kv stores',
    SET_DEVICE_KV_STORE = 'set device kv store',
    REMOVE_DEVICE_KV_STORE = 'remove device kv store',
    CLEAR_DEVICE_KV_STORES = 'clear device kv stores',
}



/**
 * The Action interface for setting a list of kv stores that belonged to a device
 * @param type - The action type
 * @param kvStores - The array of device kvStores
 */
export interface SetDeviceKVStoresAction extends BaseAction {
    readonly type: DeviceKVStoresActionType.SET_DEVICE_KV_STORES;
    readonly deviceId: number;
    readonly kvStores: readonly KeyValuePair[];
    readonly searchParams: string;
}


/**
 * The Action interface for setting a kv store that belonged to a device.
 * @param type - The action type
 * @param kvStore - The kvStore
 */
export interface SetDeviceKVStoreAction extends BaseAction {
    readonly type: DeviceKVStoresActionType.SET_DEVICE_KV_STORE;
    readonly deviceId: number;
    readonly kvStore: KeyValuePair;
}


/**
 * The Action interface for deleting a kv store that belonged to a device.
 * @param type - The action type
 * @param key - The kvStore key
 */
export interface RemoveDeviceKVStoreAction extends BaseAction {
    readonly type: DeviceKVStoresActionType.REMOVE_DEVICE_KV_STORE;
    readonly deviceId: number;
    readonly key: string;
}


/**
 * The Action interface for clearing the list of kv stores that belonged to a device
 * @param type - The action type
 */
export interface ClearDeviceKVStoresAction extends BaseAction {
    readonly type: DeviceKVStoresActionType.CLEAR_DEVICE_KV_STORES;
    readonly deviceId: number;
}



export const setDeviceKVStores = (device: number, kvStores: readonly KeyValuePair[], searchParams: string): SetDeviceKVStoresAction => {
    return {
        type    : DeviceKVStoresActionType.SET_DEVICE_KV_STORES,
        deviceId: device,
        kvStores,
        searchParams,
    };
};


export const setDeviceKVStore = (deviceId: number, kvStore: KeyValuePair): SetDeviceKVStoreAction => {
    return {
        type: DeviceKVStoresActionType.SET_DEVICE_KV_STORE,
        deviceId,
        kvStore,
    };
};


export const removeDeviceKVStore = (deviceId: number, key: string): RemoveDeviceKVStoreAction => {
    return {
        type: DeviceKVStoresActionType.REMOVE_DEVICE_KV_STORE,
        deviceId,
        key,
    };
};


export const clearDeviceKVStores = (device: number): ClearDeviceKVStoresAction => {
    return {
        type    : DeviceKVStoresActionType.CLEAR_DEVICE_KV_STORES,
        deviceId: device,
    };
};


/**
 * Fetch all key/value pairs for a given device
 */
export const fetchAllDeviceKVStores = (deviceId: number, keyPrefix?: string): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        const keyValuePairs = await AppAPI.getInstance().getAllDeviceKeyValuePairs(deviceId, keyPrefix);
        await dataDispatch(setDeviceKVStores(deviceId, keyValuePairs, searchParamsToString({
            keyPrefix,
        })));
    };
};


/**
 * Fetch a device's key/value pair
 */
export const fetchDeviceKVStore = (deviceId: number, key: string): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        const keyValuePair = await AppAPI.getInstance().getDeviceKeyValuePair(deviceId, key);
        await dataDispatch(setDeviceKVStore(deviceId, keyValuePair));
    };
};


/**
 * Update a device's key value pair
 * @param deviceId - The id of the device which we want to update
 * @param key - The key of the KV pair we want to update
 * @param value - The new value of the key value pair
 */
export const updateDeviceKVStore = (
    deviceId: number, key: string, value: any,
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        await AppAPI.getInstance().updateDeviceKeyValuePair(deviceId, key, value);
        await dataDispatch(fetchDeviceKVStore(deviceId, key));
    };
};


/**
 * Delete a device's key value pair
 * @param deviceId - The id of the device which we want to delete
 * @param key - The key of the KV pair we want to delete
 */
export const createDeviceKVStore = (
    deviceId: number, key: string, value?: any,
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        await AppAPI.getInstance().createDeviceKeyValuePair(deviceId, key, value);
        // KV store added so we need to clear the cached list of device's KV stores
        await dataDispatch(clearDeviceKVStores(deviceId));
    };
};


/**
 * Delete a device's key value pair
 * @param deviceId - The id of the device which we want to delete
 * @param key - The key of the KV pair we want to delete
 */
export const deleteDeviceKVStore = (
    deviceId: number, key: string,
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        await AppAPI.getInstance().deleteDeviceKeyValuePair(deviceId, key);
        // KV store delete so we need to clear the cached list of device's KV stores
        await dataDispatch(clearDeviceKVStores(deviceId));
        await dataDispatch(removeDeviceKVStore(deviceId, key));
    };
};
