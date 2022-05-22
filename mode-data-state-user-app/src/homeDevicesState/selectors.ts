import {
    HomeDevice,
} from '@moderepo/mode-apis';
import {
    createCachedSelector,
} from 're-reselect';
import {
    UserAppDataState,
} from '../model';
import {
    HomeDevicesState,
} from './models';


/**
 * This is the actual function that will get the data from the state and return the data requested. However, this function returns a new
 * object every time which can cause an infinite loop in re-rendering if used in React component. Therefore this function is not EXPORTED
 * and we will create another function below which use memoize to cache the result.
 */
const selectHomeDevicesFunc = (
    devicesById: HomeDevicesState['devicesById'],
    deviceIdsByHomeId: HomeDevicesState['deviceIdsByHomeId'],
    homeId: number,
): readonly HomeDevice[] | undefined => {
    return deviceIdsByHomeId?.[homeId]?.reduce((result: readonly HomeDevice[], id: number) => {
        const device = devicesById[id];
        if (device) {
            return [...result, device];
        }
        return result;
    }, []);
};



/**
 * Select ALL devices for a specific home
 */
export const selectHomeDevices = createCachedSelector(
    (state: UserAppDataState) => { return state.homeDevices.devicesById; },
    (state: UserAppDataState) => { return state.homeDevices.deviceIdsByHomeId; },
    (state: UserAppDataState, homeId: number) => { return homeId; },
    selectHomeDevicesFunc,
)((state: UserAppDataState, homeId: number) => {
    // use homeId as cache key
    return homeId.toString();
});



export const selectHomeDevice = (state: UserAppDataState, deviceId: number): HomeDevice | undefined => {
    return state.homeDevices.devicesById[deviceId];
};
