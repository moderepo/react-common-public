import {
    HomeMember, MemberRole, SortOrder,
} from '@moderepo/mode-apis';
import {
    BaseCompInputErrors, BaseHomeMemberInfoUpdatableInputs,
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
export enum HomeMemberInfoInputErrorType {
    EMPTY_EMAIL = 'empty email',                    // When email is not provided
    INVALID_EMAIL = 'invalid email',                // When email is invalid
    EMPTY_PHONE_NUMBER = 'empty phone number',      // When phone number is not provided
    EMPTY_MEMBER_ROLE = 'empty member role',        // When member role is not provided
    INVALID_MEMBER_ROLE = 'invalid member role',    // When member role is invalid
}



/**
 * This is the set of ACTUAL errors that can happen to the input field. The name of the errors should match the name of the fields to make errors
 * easier to handle. The value for the errors is an Object that has the type of error for the input and the 'inputValue' is the user's input value.
 */
export interface HomeMemberInfoInputErrors extends BaseCompInputErrors {
    email?: {
        type: HomeMemberInfoInputErrorType.EMPTY_EMAIL | HomeMemberInfoInputErrorType.INVALID_EMAIL;
        inputValue?: string | undefined;
    };
    phoneNumber?: {
        type: HomeMemberInfoInputErrorType.EMPTY_PHONE_NUMBER;
        inputValue?: string | undefined;
    };
    role?: {
        type: HomeMemberInfoInputErrorType.EMPTY_MEMBER_ROLE | HomeMemberInfoInputErrorType.INVALID_MEMBER_ROLE;
        inputValue?: MemberRole | any | undefined;
    };
}



/**
 * This is the BaseController for all logic related to Home members. It is an ABSTRACT class because there is a few function that need to be
 * implemented by specific controller. This class does not know how to make API call so it can not implement those functions.
 */
export abstract class BaseHomeMemberCompCtrl extends BaseCompCtrl {

    /**
    /**
     * Sort an Array of Home objects by the specified 'field' and in the specified sort 'order'
     * @param dataArray
     * @param field
     * @param order
     */
    public sortHomeMembers (
        dataArray: readonly HomeMember[] | undefined, field: keyof HomeMember | undefined, order: SortOrder | undefined,
    ): readonly HomeMember[] | undefined {
        if (!dataArray || !field) {
            return dataArray;
        }

        // The mapping of fieldName => compareFunction. The compareObjects function doesn't know the value type of the field therefore
        // we need to tell it which function to use.
        const compareFunctionMapping = {
            userId      : compareNumbers,
            name        : compareStrings,
            email       : compareStrings,
            phoneNumber : compareStrings,
            role        : compareStrings,
            creationTime: compareTimestamps,
            verified    : compareBooleans,
        };

        // Now sort the data using the compareFunc
        return [...dataArray].sort((data1: HomeMember, data2: HomeMember): number => {
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
     * @param members
     * @param index - The starting index
     * @param count - How many to get staring from the 'index'
     */
    public sliceMembers (members: readonly HomeMember[] | undefined, index: number, count: number): readonly HomeMember[] | undefined {
        if (members) {
            return members.slice(
                index, index + count,
            );
        }
        return undefined;
    }


    /**
     * Add a home member by email
     */
    public abstract addHomeMemberByEmail (
        inputs: BaseHomeMemberInfoUpdatableInputs,
        homeId: number,
        validationParams: {
            emailFormat: RegExp,
        },
    ): Promise<void>;


    /**
     * Add a home member by email
     */
    public abstract addHomeMemberByPhoneNumber (
        inputs: BaseHomeMemberInfoUpdatableInputs,
        homeId: number,
    ): Promise<void>;
}
