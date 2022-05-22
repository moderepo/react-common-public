import {
    KeyValuePair,
} from '@moderepo/mode-apis';


export interface HomeKVStoresState {
    readonly kvStoresByHomeIdByKey: {
        readonly [homeId: number]: {
            readonly [kvStoreKey: string]: KeyValuePair | undefined;
        } | undefined;
    };
    readonly kvStoreKeysByHomeId: {
        readonly [homeId: number]: {
            readonly [searchParams: string]: readonly string[] | undefined;
        } | undefined;
    };
}


export const initialHomeKVStoresState: HomeKVStoresState = {
    kvStoresByHomeIdByKey: {
    },
    kvStoreKeysByHomeId: {
    },
};
