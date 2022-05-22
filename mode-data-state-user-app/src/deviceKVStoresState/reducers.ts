import produce, {
    castDraft, Draft,
} from 'immer';
import {
    KeyValuePair,
} from '@moderepo/mode-apis';
import {
    BaseAction,
} from '@moderepo/mode-data-state-base';
import {
    DeviceKVStoresActionType, SetDeviceKVStoresAction, SetDeviceKVStoreAction, ClearDeviceKVStoresAction, RemoveDeviceKVStoreAction,
}
    from './actions';
import {
    DeviceKVStoresState,
} from './models';


const kvStoresByDeviceIdByKeyReducer = (
    currentState: DeviceKVStoresState['kvStoresByDeviceIdByKey'], action: BaseAction,
): DeviceKVStoresState['kvStoresByDeviceIdByKey'] => {
    const { type } = action;

    switch (type) {
        case DeviceKVStoresActionType.SET_DEVICE_KV_STORES:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetDeviceKVStoresAction;
                const temp = draft[actualAction.deviceId] || {
                };
                draft[actualAction.deviceId] = temp;
                actualAction.kvStores.forEach((kvStore: KeyValuePair) => {
                    temp[kvStore.key] = kvStore;
                });
            });

        case DeviceKVStoresActionType.SET_DEVICE_KV_STORE:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetDeviceKVStoreAction;
                const temp = draft[actualAction.deviceId] || {
                };
                draft[actualAction.deviceId] = temp;
                temp[actualAction.kvStore.key] = actualAction.kvStore;
            });

        case DeviceKVStoresActionType.REMOVE_DEVICE_KV_STORE:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as RemoveDeviceKVStoreAction;
                const temp = draft[actualAction.deviceId] || {
                };
                delete temp[actualAction.key];
            });

        default:
            return currentState;
    }
};



const kvStoreKeysByDeviceIdReducer = (
    currentState: DeviceKVStoresState['kvStoreKeysByDeviceId'], action: BaseAction,
): DeviceKVStoresState['kvStoreKeysByDeviceId'] => {

    const { type } = action;

    switch (type) {
        case DeviceKVStoresActionType.SET_DEVICE_KV_STORES:

            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetDeviceKVStoresAction;
                const temp = draft[actualAction.deviceId] || {
                };
                draft[actualAction.deviceId] = temp;

                // get the list of the keys from the actualAction.kvStores and save them
                temp[actualAction.searchParams] = actualAction.kvStores.map((kvStore: KeyValuePair): string => {
                    return kvStore.key;
                });
            });

        case DeviceKVStoresActionType.CLEAR_DEVICE_KV_STORES:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as ClearDeviceKVStoresAction;
                delete draft[actualAction.deviceId];
            });

        default:
            return currentState;
    }
};



export const deviceKVStoresStateReducer = (currentState: DeviceKVStoresState, action: BaseAction): DeviceKVStoresState => {
    return produce(currentState, (draft: Draft<DeviceKVStoresState>) => {
        draft.kvStoresByDeviceIdByKey = kvStoresByDeviceIdByKeyReducer(currentState.kvStoresByDeviceIdByKey, action);
        draft.kvStoreKeysByDeviceId = castDraft(kvStoreKeysByDeviceIdReducer(currentState.kvStoreKeysByDeviceId, action));
    });
};
