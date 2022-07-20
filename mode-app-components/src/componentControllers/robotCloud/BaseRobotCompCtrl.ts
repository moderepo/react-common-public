import {
    RobotInfo, SortOrder,
} from '@moderepo/mode-apis';
import {
    compareBooleans, compareNumbers, compareObjects, compareStrings, compareTimestamps,
} from '../../utils';
import {
    BaseCompCtrl,
} from '../BaseCompCtrl';



/**
 * This is the BaseController for all logic related to Robots. It is an ABSTRACT class because there is a few function that need to be implemented
 * by specific controller. This class does not know how to make API call so it can not implement those functions.
 */
export abstract class BaseRobotCompCtrl extends BaseCompCtrl {

    /**
     * Sort an Array of Robots objects by the specified 'field' and in the specified sort 'order'
     * @param dataArray
     * @param field
     * @param order
     */
    public sortRobots (
        dataArray: readonly RobotInfo[] | undefined, field: keyof RobotInfo | undefined, order: SortOrder | undefined,
    ): readonly RobotInfo[] | undefined {
        if (!dataArray || !field) {
            return dataArray;
        }

        // The mapping of fieldName => compareFunction. The compareObjects function doesn't know the value type of the field therefore
        // we need to tell it which function to use.
        const compareFunctionMapping = {
            deviceId  : compareNumbers,
            homeId    : compareNumbers,
            projectId : compareNumbers,
            name      : compareStrings,
            id        : compareStrings,
            robotClass: compareStrings,
            driverName: compareStrings,
            createdAt : compareTimestamps,
            updatedAt : compareBooleans,
        };

        // Now sort the data using the compareFunc
        return [...dataArray].sort((data1: RobotInfo, data2: RobotInfo): number => {
            // Compare the 1 element using ASCENDING order and then multiply the result with -1 if the sort order is DESC
            const ascCompareResult = compareObjects(data1, data2, field, compareFunctionMapping);

            if (order === SortOrder.DESC) {
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
    public sliceRobots (dataArray: readonly RobotInfo[] | undefined, index: number, count: number): readonly RobotInfo[] | undefined {
        if (dataArray) {
            return dataArray.slice(
                index, index + count,
            );
        }
        return undefined;
    }

}
