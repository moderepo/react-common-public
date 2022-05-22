import {
    HomeDevice,
} from '@moderepo/mode-apis';


export interface HomeDevicesState {
    readonly devicesById: {
        [deviceId: number]: HomeDevice | undefined;
    };
    readonly deviceIdsByHomeId: {
        [homeId: number]: readonly number[] | undefined;
    };
}


export const initialHomeDevicesState: HomeDevicesState = {
    devicesById: {
    },
    deviceIdsByHomeId: {
    },
};
