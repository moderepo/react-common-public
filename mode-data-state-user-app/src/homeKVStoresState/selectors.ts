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
    HomeKVStoresState,
} from './models';



/**
 * This is the actual function that will get the data from the state and return the data requested. However, this function returns a new
 * object every time which can cause an infinite loop in re-rendering if used in React component. Therefore this function is not EXPORTED
 * and we will create another function below which use memoize to cache the result.
 */
const selectAllHomeKVStoresFunc = (
    kvStoresByHomeIdByKey: HomeKVStoresState['kvStoresByHomeIdByKey'],
    kvStoreKeysByHomeId: HomeKVStoresState['kvStoreKeysByHomeId'],
    homeId: number,
    searchParams: string,
): readonly KeyValuePair[] | undefined => {
    return kvStoreKeysByHomeId?.[homeId]?.[searchParams]?.reduce((result: readonly KeyValuePair[], key: string) => {
        const kvPair = kvStoresByHomeIdByKey[homeId]?.[key];
        if (kvPair) {
            return [...result, kvPair];
        }
        return result;
    }, []);
};



/**
 * Select ALL KV stores for a specific home
 */
export const selectAllHomeKVStores = createCachedSelector(
    (state: UserAppDataState) => { return state.homeKVStores.kvStoresByHomeIdByKey; },
    (state: UserAppDataState) => { return state.homeKVStores.kvStoreKeysByHomeId; },
    (state: UserAppDataState, homeId: number) => { return homeId; },
    (state: UserAppDataState, homeId: number, searchParams?: {
        readonly keyPrefix?: string | undefined;
    }) => { return searchParamsToString(searchParams); },
    selectAllHomeKVStoresFunc,
)((state: UserAppDataState, homeId: number, searchParams?: {
    readonly keyPrefix?: string | undefined;
}) => {
    // use searchParams as cache key for createCachedSelector
    return searchParamsToString(searchParams);
});



export const selectHomeKVStore = (state: UserAppDataState, homeId: number, key: string): KeyValuePair | undefined => {
    return state.homeKVStores.kvStoresByHomeIdByKey[homeId]?.[key];
};
