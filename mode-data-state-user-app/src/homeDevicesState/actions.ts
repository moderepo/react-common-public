import {
    AppAPI, HomeDevice, UpdatableHomeDeviceProps,
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
export enum HomeDevicesActionType {
    SET_HOME_DEVICES = 'set home devices',
    SET_HOME_DEVICE = 'set home device',
    CLEAR_HOME_DEVICES = 'clear home devices',
}



/**
 * The Action interface for setting a list of devices that belonged to a home
 * @param type - The action type
 * @param devices - The array of home devices
 */
export interface SetHomeDevicesAction extends BaseAction {
    readonly type: HomeDevicesActionType.SET_HOME_DEVICES;
    readonly homeId: number;
    readonly devices: readonly HomeDevice[];
}


/**
 * The Action interface for setting a home device that belonged to a home.
 * @param type - The action type
 * @param device - The device
 */
export interface SetHomeDeviceAction extends BaseAction {
    readonly type: HomeDevicesActionType.SET_HOME_DEVICE;
    readonly homeId: number;
    readonly device: HomeDevice;
}


/**
 * The Action interface for clearing all the devices that belonged to a home
 * @param type - The action type
 */
export interface ClearHomeDevicesAction extends BaseAction {
    readonly type: HomeDevicesActionType.CLEAR_HOME_DEVICES;
    readonly homeId: number;
}



export const setHomeDevices = (homeId: number, devices: readonly HomeDevice[]): SetHomeDevicesAction => {
    return {
        type: HomeDevicesActionType.SET_HOME_DEVICES,
        homeId,
        devices,
    };
};



export const setHomeDevice = (homeId: number, device: HomeDevice): SetHomeDeviceAction => {
    return {
        type: HomeDevicesActionType.SET_HOME_DEVICE,
        homeId,
        device,
    };
};


export const clearHomeDevices = (homeId: number): ClearHomeDevicesAction => {
    return {
        type: HomeDevicesActionType.CLEAR_HOME_DEVICES,
        homeId,
    };
};



/**
 * Get all devices belonged to a home
 * @param homeId - The id of the home to look for
 */
export const fetchHomeDevices = (homeId: number): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        const devices = await AppAPI.getInstance().getHomeDevices(homeId);
        await dataDispatch(setHomeDevices(homeId, devices));
    };
};



/**
 * Get home device by id
 * @param homeId - The id of the home the device belonged to
 * @param deviceId - The id of the device to look for
 */
export const fetchHomeDevice = (homeId: number, deviceId: number): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        const device = await AppAPI.getInstance().getHomeDeviceById(deviceId);
        await dataDispatch(setHomeDevice(homeId, device));
    };
};


/**
 * Remove a device from a home
 * @param deviceId - The id of the device we want to remove
 */
export const removeHomeDevice = (homeId: number, deviceId: number): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        await AppAPI.getInstance().removeHomeDevice(deviceId);
        // A device is removed from a home, we need to clear the home devices so that we can fetch the new list
        await dataDispatch(clearHomeDevices(homeId));
    };
};



/**
 * Update a project device.
 * @param homeId - The id of the home the device belonged to
 * @param deviceId - The id of the device which we want to get
 * @param updatedData - The object including fields/values you want to update. The fields that can be updated are
 *                      name, tag, and claimCode
 * @param projectApiKey - The key to use if we want to update restricted props e.g. homeId or claimCode
 */
export const updateHomeDevice = (
    homeId: number, deviceId: number, updatedData: UpdatableHomeDeviceProps, projectApiKey?: string,
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        await AppAPI.getInstance().updateHomeDevice(deviceId, updatedData, projectApiKey);

        // Reload device info since it has been updated
        await dataDispatch(fetchHomeDevice(homeId, deviceId));
    };
};



/**
 * Add a device to a home
 * @param homeId - The id of them home we want to add the device to
 * @param claimCode - The device claim code
 */
export const addPreprovisionedHomeDevice = (homeId: number, claimCode: string): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        await AppAPI.getInstance().addPreprovisionedHomeDevice(homeId, claimCode);
        // A device is added to a home, we need to clear the home devices so that we can fetch the new list
        await dataDispatch(clearHomeDevices(homeId));
    };
};
