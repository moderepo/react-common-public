import {
    AppAPI, DeviceConfigFirmwareSchema,
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
export enum DeviceConfigSchemasActionType {
    SET_DEVICE_CONFIG_SCHEMAS = 'set device config schemas',
    CLEAR_DEVICE_CONFIG_SCHEMAS = 'clear device config schemas',
}



/**
 * The Action interface for setting a list of device config schemas that belonged to a device
 * @param type - The action type
 * @param deviceId - The deviceId the schema belongs to
 * @param schemas - The array of device schemas
 */
export interface SetDeviceConfigSchemasAction extends BaseAction {
    readonly type: DeviceConfigSchemasActionType.SET_DEVICE_CONFIG_SCHEMAS;
    readonly deviceId: number;
    readonly schemas: readonly DeviceConfigFirmwareSchema[];
}


/**
 * The Action interface for clearing the list of device config schemas that belonged to a device
 * @param type - The action type
 * @param deviceId - The deviceId the schema belongs to
 */
export interface ClearDeviceConfigSchemasAction extends BaseAction {
    readonly type: DeviceConfigSchemasActionType.CLEAR_DEVICE_CONFIG_SCHEMAS;
    readonly deviceId: number;
}


export const setDeviceConfigSchemas = (deviceId: number, schemas: readonly DeviceConfigFirmwareSchema[]): SetDeviceConfigSchemasAction => {
    return {
        type: DeviceConfigSchemasActionType.SET_DEVICE_CONFIG_SCHEMAS,
        deviceId,
        schemas,
    };
};


export const clearDeviceConfigSchemas = (deviceId: number): ClearDeviceConfigSchemasAction => {
    return {
        type: DeviceConfigSchemasActionType.CLEAR_DEVICE_CONFIG_SCHEMAS,
        deviceId,
    };
};


/**
 * Get all config schemas belonged to a device
 * @param deviceId - The id of the device to look for
 */
export const fetchDeviceConfigSchemas = (deviceId: number): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        const schemas = await AppAPI.getInstance().getDeviceConfigurationSchemas(deviceId);
        await dataDispatch(setDeviceConfigSchemas(deviceId, schemas));
    };
};
