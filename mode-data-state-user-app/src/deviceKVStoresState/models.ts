import {
    KeyValuePair,
} from '@moderepo/mode-apis';


export interface DeviceKVStoresState {
    readonly kvStoresByDeviceIdByKey: {
        readonly [deviceId: number]: {
            [kvStoreKey: string]: KeyValuePair | undefined;
        } | undefined;
    };
    readonly kvStoreKeysByDeviceId: {
        readonly [deviceId: number]: {
            readonly [searchParams: string]: readonly string[] | undefined;
        } | undefined;
    };
}


export const initialDeviceKVStoresState: DeviceKVStoresState = {
    kvStoresByDeviceIdByKey: {
    },
    kvStoreKeysByDeviceId: {
    },
};
