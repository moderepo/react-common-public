import {
    DeviceConfigFirmwareSchema,
} from '@moderepo/mode-apis';
import {
    UserAppDataState,
} from '../model';



export const selectDeviceConfigSchemas = (state: UserAppDataState, deviceId: number): readonly DeviceConfigFirmwareSchema[] | undefined => {
    return state.deviceConfigSchemas.schemasByDeviceId[deviceId];
};
