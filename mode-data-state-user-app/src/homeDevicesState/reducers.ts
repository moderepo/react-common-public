import produce, {
    castDraft, Draft,
} from 'immer';
import {
    HomeDevice,
} from '@moderepo/mode-apis';
import {
    BaseAction,
} from '@moderepo/mode-data-state-base';
import {
    HomeDevicesActionType, SetHomeDevicesAction, SetHomeDeviceAction, ClearHomeDevicesAction,
} from './actions';
import {
    HomeDevicesState,
} from './models';


const homeDevicesByIdReducer = (
    currentState: HomeDevicesState['devicesById'], action: BaseAction,
): HomeDevicesState['devicesById'] => {
    const { type } = action;

    switch (type) {
        case HomeDevicesActionType.SET_HOME_DEVICES:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetHomeDevicesAction;

                actualAction.devices.forEach((device: HomeDevice) => {
                    draft[device.id] = device;
                });
            });

        case HomeDevicesActionType.SET_HOME_DEVICE:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetHomeDeviceAction;
                draft[actualAction.device.id] = actualAction.device;
            });

        default:
            return currentState;
    }
};


const allHomeDeviceIdsReducer = (currentState: readonly number[] | undefined, action: BaseAction): readonly number[]|undefined => {
    const { type } = action;
    switch (type) {
        case HomeDevicesActionType.SET_HOME_DEVICES:
            return produce(currentState, () => {
                const actualAction = action as SetHomeDevicesAction;

                // convert the list of actualAction.devices to an Array of devices ids and update the currentState with the new
                // list. NOTE: only need to update the currentState if NOT both of them are empty. If both of them are empty,
                // do not need to run this or else it will replace the currentState with a NEW empty array which cause unnecessary
                // UI re-render.
                if (actualAction.devices.length !== 0 || !currentState || currentState.length !== 0) {
                    return actualAction.devices.map((device: HomeDevice): number => {
                        return device.id;
                    });
                }

                return currentState;
            });
    
        default:
            return currentState;
    }
};


const homeDeviceIdsByHomeIdReducer = (
    currentState: HomeDevicesState['deviceIdsByHomeId'], action: BaseAction,
): HomeDevicesState['deviceIdsByHomeId'] => {

    const { type } = action;

    switch (type) {
        case HomeDevicesActionType.SET_HOME_DEVICES:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const { homeId } = action as SetHomeDevicesAction;
                draft[homeId] = castDraft(allHomeDeviceIdsReducer(currentState[homeId], action));
            });

        case HomeDevicesActionType.CLEAR_HOME_DEVICES:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const { homeId } = action as ClearHomeDevicesAction;
                delete draft[homeId];
            });

        default:
            return currentState;
    }
};



export const homeDevicesStateReducer = (currentState: HomeDevicesState, action: BaseAction): HomeDevicesState => {
    return produce(currentState, (draft: Draft<HomeDevicesState>) => {
        draft.devicesById = homeDevicesByIdReducer(currentState.devicesById, action);
        draft.deviceIdsByHomeId = castDraft(homeDeviceIdsByHomeIdReducer(currentState.deviceIdsByHomeId, action));
    });
};
