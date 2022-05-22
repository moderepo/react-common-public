import {
    HomeDevice,
} from '@moderepo/mode-apis';
import {
    BaseCompInputErrors, BaseDeviceInfoUpdatableInputs, FieldSortOrder,
} from '../componentInterfaces';
import {
    compareBooleans, compareNumbers, compareObjects, compareStrings, compareTimestamps,
} from '../utils';
import {
    BaseCompCtrl,
} from './BaseCompCtrl';


/**
 * The types of input error that can happen to the input field
 */
export enum DeviceInfoInputErrorType {
    EMPTY_DEVICE_CLASS = 'empty device class',          // When device class is not provided
    EMPTY_CLAIM_CODE = 'empty claim code',              // When claim code is not provided
    INVALID_CLAIM_CODE = 'invalid claim code',          // When claim code is invalid
}



/**
 * This is the set of ACTUAL errors that can happen to the input field. The name of the errors should match the name of the fields to make errors
 * easier to handle. The value for the errors is an Object that has the type of error for the input and the 'inputValue' is the user's input value.
 */
export interface DeviceInfoInputErrors extends BaseCompInputErrors {
    deviceClass?: {
        type: DeviceInfoInputErrorType.EMPTY_DEVICE_CLASS;
        inputValue?: string | undefined;
    };
    claimCode?: {
        type: DeviceInfoInputErrorType.EMPTY_CLAIM_CODE | DeviceInfoInputErrorType.INVALID_CLAIM_CODE;
        inputValue?: string | undefined;
    };
}



/**
 * This is the BaseController for all logic related to Home Devices. It is an ABSTRACT class because there is a few function that need to be
 * implemented by specific controller. This class does not know how to make API call so it can not implement those functions.
 */
export abstract class BaseDeviceCompCtrl extends BaseCompCtrl {

    /**
     * Sort an Array of Home objects by the specified 'field' and in the specified sort 'order'
     * @param dataArray
     * @param field
     * @param order
     */
    public sortHomeDevices (
        dataArray: readonly HomeDevice[] | undefined, field: keyof HomeDevice | undefined, order: FieldSortOrder | undefined,
    ): readonly HomeDevice[] | undefined {
        if (!dataArray || !field) {
            return dataArray;
        }

        // The mapping of fieldName => compareFunction. The compareObjects function doesn't know the value type of the field therefore
        // we need to tell it which function to use.
        const compareFunctionMapping = {
            id                 : compareNumbers,
            homeId             : compareNumbers,
            projectId          : compareNumbers,
            name               : compareStrings,
            deviceClass        : compareStrings,
            tag                : compareStrings,
            claimTime          : compareTimestamps,
            claimExpirationTime: compareTimestamps,
            lastConnectTime    : compareTimestamps,
            lastDisconnectTime : compareTimestamps,
            isConnected        : compareBooleans,
            PrivateConnOnly    : compareBooleans,
        };

        // Now sort the data using the compareFunc
        return [...dataArray].sort((data1: HomeDevice, data2: HomeDevice): number => {
            // Compare the 1 element using ASCENDING order and then multiply the result with -1 if the sort order is DESC
            const ascCompareResult = compareObjects(data1, data2, field, compareFunctionMapping);

            if (order === FieldSortOrder.DESC) {
                return ascCompareResult * -1;
            }
            return ascCompareResult;
        });
    }


    /**
     * Get a subset of devices from the list of HomeDevices starting from 'index' and end at 'index' + 'count'
     * @param devices
     * @param index - The starting index
     * @param count - How many to get staring from the 'index'
     */
    public sliceHomeDevices (devices: readonly HomeDevice[] | undefined, index: number, count: number): readonly HomeDevice[] | undefined {
        if (devices) {
            return devices.slice(
                index, index + count,
            );
        }
        return undefined;
    }


    /**
     * This function will make an API call to update a Home Device data with the given 'inputs'. This function should also handle validating the
     * 'inputs' and reject with DeviceInfoCompInputErrors if the input value is invalid or if API call failed.
     *
     * @param inputs
     * @param currentDevice
     * @param homeId - The id of the home the device belonged to
     * @returns a Promise that resolve 'true' if the input data is not the same as current Device data and device is updated successfully. Return
     *      'false' if 'inputs' contain the same data as the current data and NO api call is made. NOTE: value 'false' DOES NOT mean update was
     *      unsuccessful. 'false' means update was not needed because the data is the same.
     */
    public abstract updateHomeDeviceInfo (
        inputs: BaseDeviceInfoUpdatableInputs,
        currentDevice: HomeDevice,
        homeId: number,
    ): Promise<{
        readonly isDataModified: boolean
    }>;
}
