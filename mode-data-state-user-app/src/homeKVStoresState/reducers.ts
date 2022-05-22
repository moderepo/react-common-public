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
    HomeKVStoresActionType, SetHomeKVStoresAction, SetHomeKVStoreAction, ClearHomeKVStoresAction, RemoveHomeKVStoreAction,
} from './actions';
import {
    HomeKVStoresState,
} from './models';


const kvStoresByHomeIdByKeyReducer = (
    currentState: HomeKVStoresState['kvStoresByHomeIdByKey'], action: BaseAction,
): HomeKVStoresState['kvStoresByHomeIdByKey'] => {
    const { type } = action;

    switch (type) {
        case HomeKVStoresActionType.SET_HOME_KV_STORES:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetHomeKVStoresAction;
                const temp = draft[actualAction.homeId] || {
                };
                draft[actualAction.homeId] = temp;
                
                actualAction.kvStores.forEach((kvStore: KeyValuePair) => {
                    temp[kvStore.key] = kvStore;
                });
            });

        case HomeKVStoresActionType.SET_HOME_KV_STORE:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetHomeKVStoreAction;
                const temp = draft[actualAction.homeId] || {
                };
                draft[actualAction.homeId] = temp;
                
                temp[actualAction.kvStore.key] = actualAction.kvStore;
            });

        case HomeKVStoresActionType.REMOVE_HOME_KV_STORE:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as RemoveHomeKVStoreAction;
                const temp = draft[actualAction.homeId] || {
                };
                delete temp[actualAction.key];
            });

        default:
            return currentState;
    }
};



const kvStoreKeysByHomeIdReducer = (
    currentState: HomeKVStoresState['kvStoreKeysByHomeId'],
    action: BaseAction,
): HomeKVStoresState['kvStoreKeysByHomeId'] => {

    const { type } = action;

    switch (type) {
        case HomeKVStoresActionType.SET_HOME_KV_STORES:

            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetHomeKVStoresAction;
                const temp = draft[actualAction.homeId] || {
                };
                draft[actualAction.homeId] = temp;
                
                // Get the list of keys from the actualAction.kvStores and save the keys
                temp[actualAction.searchParams] = actualAction.kvStores.map((kvStore: KeyValuePair): string => {
                    return kvStore.key;
                });
            });

        case HomeKVStoresActionType.CLEAR_HOME_KV_STORES:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as ClearHomeKVStoresAction;
                delete draft[actualAction.homeId];
            });

        default:
            return currentState;
    }
};



export const homeKVStoresStateReducer = (currentState: HomeKVStoresState, action: BaseAction): HomeKVStoresState => {
    return produce(currentState, (draft: Draft<HomeKVStoresState>) => {
        draft.kvStoresByHomeIdByKey = kvStoresByHomeIdByKeyReducer(currentState.kvStoresByHomeIdByKey, action);
        draft.kvStoreKeysByHomeId = castDraft(kvStoreKeysByHomeIdReducer(currentState.kvStoreKeysByHomeId, action));
    });
};
