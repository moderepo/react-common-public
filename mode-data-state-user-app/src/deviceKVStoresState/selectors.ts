import {
    createCachedSelector,
} from 're-reselect';
import {
    KeyValuePair,
} from '@moderepo/mode-apis';
import {
    searchParamsToString,
} from '@moderepo/mode-data-state-base';
import {
    UserAppDataState,
} from '../model';
import {
    DeviceKVStoresState,
} from './models';



/**
 * This is the actual function that will get the data from the state and return the data requested. However, this function returns a new
 * object every time which can cause an infinite loop in re-rendering if used in React component. Therefore this function is not EXPORTED
 * and we will create another function below which use memoize to cache the result.
 */
const selectAllDeviceKVStoresFunc = (
    kvStoresByDeviceIdByKey: DeviceKVStoresState['kvStoresByDeviceIdByKey'],
    kvStoreKeysByDeviceId: DeviceKVStoresState['kvStoreKeysByDeviceId'],
    deviceId: number,
    searchParams: string,
): readonly KeyValuePair[] | undefined => {
    return kvStoreKeysByDeviceId?.[deviceId]?.[searchParams]?.reduce((result: readonly KeyValuePair[], key: string) => {
        const kvPair = kvStoresByDeviceIdByKey[deviceId]?.[key];
        if (kvPair) {
            return [...result, kvPair];
        }
        return result;
    }, []);
};



/**
 * Select ALL KV stores for a specific device
 */
export const selectAllDeviceKVStores = createCachedSelector(
    (state: UserAppDataState) => { return state.deviceKVStores.kvStoresByDeviceIdByKey; },
    (state: UserAppDataState) => { return state.deviceKVStores.kvStoreKeysByDeviceId; },
    (state: UserAppDataState, deviceId: number) => { return deviceId; },
    (state: UserAppDataState, deviceId: number, searchParams?: {
        readonly keyPrefix?: string | undefined;
    }) => { return searchParamsToString(searchParams); },
    selectAllDeviceKVStoresFunc,
)((state: UserAppDataState, deviceId: number, searchParams?: {
    readonly keyPrefix?: string | undefined;
}) => {
    // use searchParams as cache key for createCachedSelector
    return searchParamsToString(searchParams);
});



export const selectDeviceKVStore = (state: UserAppDataState, deviceId: number, key: string): KeyValuePair | undefined => {
    if (state.deviceKVStores.kvStoresByDeviceIdByKey[deviceId]) {
        return state.deviceKVStores.kvStoresByDeviceIdByKey[deviceId]?.[key];
    }
    return undefined;
};
