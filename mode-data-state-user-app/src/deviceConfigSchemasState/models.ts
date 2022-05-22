import {
    DeviceConfigFirmwareSchema,
} from '@moderepo/mode-apis';


export interface DeviceConfigSchemasState {
    readonly schemasByDeviceId: {
        readonly [deviceId: number]: readonly DeviceConfigFirmwareSchema[] | undefined;
    };
}


export const initialDeviceConfigSchemasState: DeviceConfigSchemasState = {
    schemasByDeviceId: {
    },
};
