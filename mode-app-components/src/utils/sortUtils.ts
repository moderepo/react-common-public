/**
 * Compare 2 values as numbers. Return 1 if value1 is larger than value2, -1 if value2 is larger than value1, and 0 if they are equal
 * @param value1
 * @param value2
 * @returns
 */
export const compareNumbers = (value1: number | undefined, value2: number | undefined): number => {
    if (value1 !== undefined && value2 !== undefined) {
        return value1 - value2;
    }
    if (value1 !== undefined) {
        return 1;
    }
    if (value2 !== undefined) {
        return -1;
    }
    return 0;
};


/**
 * Compare 2 values as string. Return 1 if value1 is larger than value2, -1 if value2 is larger than value1, and 0 if they are equal
 * @param value1
 * @param value2
 * @returns
 */
export const compareStrings = (value1: string | undefined, value2: string | undefined): number => {
    if (value1 !== undefined && value2 !== undefined) {
        const v1 = value1.toLocaleLowerCase();
        const v2 = value2.toLocaleLowerCase();
        if (v1 < v2) {
            return -1;
        }
        if (v1 > v2) {
            return 1;
        }
        return 0;
    }
    if (value1 !== undefined) {
        return 1;
    }
    if (value2 !== undefined) {
        return -1;
    }
    return 0;
};


/**
 * Compare 2 values as timestamp string. Return 1 if value1 is larger than value2, -1 if value2 is larger than value1, and 0 if they are equal
 * @param value1
 * @param value2
 * @returns
 */
export const compareTimestamps = (value1: string | undefined, value2: string | undefined): number => {
    if (value1 !== undefined && value2 !== undefined) {
        return Date.parse(value1) - Date.parse(value2);
    }
    if (value1 !== undefined) {
        return 1;
    }
    if (value2 !== undefined) {
        return -1;
    }
    return 0;
};


/**
 * Compare 2 values as boolean. Return 1 if value1 is larger than value2, -1 if value2 is larger than value1, and 0 if they are equal
 * @param value1
 * @param value2
 * @returns
 */
export const compareBooleans = (value1: boolean | undefined, value2: boolean | undefined): number => {
    if (value1 !== undefined && value2 !== undefined) {
        return Number(value1) - Number(value2);
    }
    if (value1 !== undefined) {
        return 1;
    }
    if (value2 !== undefined) {
        return -1;
    }
    return 0;
};


export type CompareFunction<T> = (value1: T | undefined, value2: T | undefined)=> number;


/**
 * Helper function to compare 2 objects use for sorting. This will return 1 if obj1 is larger, -1 if obj2 is larger, 0 if they are equal
 * @param obj1
 * @param obj2
 * @param fieldName - The objects can have many fields therefore the caller need to tell the function which field to use for comparison
 * @param compareFunctionMapping - This function doesn't know the type of the object's field value therefore the caller needs to tell the
 *                                 function which compare function to use for which field, compareNumbers, compareStrings, etc... For example
 *                                  // This mapping tells the function to compare 'id' fields as numbers, 'name' as strings, and 'createDate'
 *                                  // as timestamp
 *                                  {
 *                                      id: compareNumbers,
 *                                      name: compareStrings,
 *                                      createDate: compareTimestamps,
 *                                      ...
 *                                  }
 * @returns
 */
export const compareObjects = (obj1: object | undefined, obj2: object | undefined, fieldName: string, compareFunctionMapping: {
    [compareFieldName: string]: CompareFunction<any>
}): number => {

    const compareFunc = compareFunctionMapping[fieldName];
    if (compareFunc) {
        if (obj1 && obj2) {
            return compareFunc(obj1[fieldName], obj2[fieldName]);
        }
        if (obj1) {
            return 1;
        }
        return -1;
    }
    return 0;
};
