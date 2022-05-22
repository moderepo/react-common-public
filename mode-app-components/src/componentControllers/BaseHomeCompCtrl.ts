import {
    Home,
} from '@moderepo/mode-apis';
import {
    BaseCompInputErrors, BaseHomeInfoUpdatableInputs, FieldSortOrder,
} from '../componentInterfaces';
import {
    compareNumbers, compareObjects, compareStrings, compareTimestamps,
} from '../utils';
import {
    BaseCompCtrl,
} from './BaseCompCtrl';



/**
 * The types of input error that can happen to the input field
 */
export enum HomeInfoInputErrorType {
    EMPTY_NAME = 'empty name',          // When name is not provided
}



/**
 * This is the set of ACTUAL errors that can happen to the input field. The name of the errors should match the name of the fields to make errors
 * easier to handle. The value for the errors is an Object that has the type of error for the input and the 'inputValue' is the user's input value.
 */
export interface HomeInfoInputErrors extends BaseCompInputErrors {
    name?: {
        type: HomeInfoInputErrorType.EMPTY_NAME;
        inputValue?: string | undefined;
    };
}



/**
 * This is the BaseController for all logic related to Home. It is an ABSTRACT class because there is a few function that need to be implemented
 * by specific controller. This class does not know how to make API call so it can not implement those functions.
 */
export abstract class BaseHomeCompCtrl extends BaseCompCtrl {

    /**
     * Sort an Array of Home objects by the specified 'field' and in the specified sort 'order'
     * @param dataArray
     * @param field
     * @param order
     */
    public sortHomes (
        dataArray: readonly Home[] | undefined, field: keyof Home | undefined, order: FieldSortOrder | undefined,
    ): readonly Home[] | undefined {
        if (!dataArray || !field) {
            return dataArray;
        }

        // The mapping of fieldName => compareFunction. The compareObjects function doesn't know the value type of the field therefore
        // we need to tell it which function to use.
        const compareFunctionMapping = {
            id          : compareNumbers,
            projectId   : compareNumbers,
            name        : compareStrings,
            creationTime: compareTimestamps,
        };

        // Now sort the data using the compareFunc
        return [...dataArray].sort((data1: Home, data2: Home): number => {
            // Compare the 1 element using ASCENDING order and then multiply the result with -1 if the sort order is DESC
            const ascCompareResult = compareObjects(data1, data2, field, compareFunctionMapping);

            if (order === FieldSortOrder.DESC) {
                return ascCompareResult * -1;
            }
            return ascCompareResult;
        });
    }


    /**
     * Get a subset of members from the list of members starting from 'index' and end at 'index' + 'count'
     * @param dataArray
     * @param index - The starting index
     * @param count - How many to get staring from the 'index'
     */
    public sliceHomes (dataArray: readonly Home[] | undefined, index: number, count: number): readonly Home[] | undefined {
        if (dataArray) {
            return dataArray.slice(
                index, index + count,
            );
        }
        return undefined;
    }


    /**
     * This function will make an API call to update a Home data with the given 'inputs'. This function should also handle validating the 'inputs'
     * and reject with HomeInfoInputErrors if the input value is invalid or if API call failed.
     *
     * @param inputs
     * @param currentHome
     * @returns a Promise that resolve 'true' if the input data is not the same as current Home data and home is updated successfully. Return 'false'
     *      if 'inputs' contain the same data as the current data and NO api call is made. NOTE: value 'false' DOES NOT mean update was unsuccessful.
     *      'false' means update was not needed because the data is the same.
     */
    public abstract updateHomeInfo (
        inputs: BaseHomeInfoUpdatableInputs,
        currentHome: Home,
    ): Promise<{
        readonly isDataModified: boolean
    }>;


    /**
     * This function will make an API call to CREATE a Home with the given 'inputs'. This function should also handle validating the 'inputs'
     * and reject with HomeInfoInputErrors if the input value is invalid or if API call failed.
     * @param inputs - The user input that contains the data for the new home
     * @param userId - The id of the user the home should be added to
     */
    public abstract createHomeForUser (
        inputs: BaseHomeInfoUpdatableInputs,
        userId: number,
    ): Promise<boolean>;
}
