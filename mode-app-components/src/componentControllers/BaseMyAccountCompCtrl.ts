import {
    User,
} from '@moderepo/mode-apis';
import {
    BaseCompInputErrors, BaseUserInfoUpdatableInputs,
} from '../componentInterfaces';
import {
    BaseCompCtrl,
} from './BaseCompCtrl';



/**
 * The types of input error that can happen to the input field
 */
export enum MyAccountInfoInputErrorType {
    EMPTY_NAME = 'empty name',                          // When name is not provided
    EMPTY_CONFIRM_PASSWORD = 'empty confirm password',  // When confirm password is not provided
    PASSWORD_MISMATCH = 'password mismatch',            // When confirm password doesn't match password
}



/**
 * This is the set of ACTUAL errors that can happen to the input field. The name of the errors should match the name of the fields to make errors
 * easier to handle. The value for the errors is an Object that has the type of error for the input and the 'inputValue' is the user's input value.
 */
export interface MyAccountInfoInputErrors extends BaseCompInputErrors {
    name?: {
        type: MyAccountInfoInputErrorType.EMPTY_NAME;
        inputValue?: string | undefined;
    };
    confirmPassword?: {
        type: MyAccountInfoInputErrorType.EMPTY_CONFIRM_PASSWORD | MyAccountInfoInputErrorType.PASSWORD_MISMATCH;
        inputValue?: string | undefined;
    };
}



/**
 * This is the BaseController for all logic related to logged in user. It is an ABSTRACT class because there is a few function that need to be
 * implemented by specific controller. This class does not know how to make API call so it can not implement those functions.
 */
export abstract class BaseMyAccountCompCtrl extends BaseCompCtrl {

    public abstract updateMyAccount (
        inputs: BaseUserInfoUpdatableInputs,
        currentUser: User,
    ): Promise<{
        readonly isDataModified: boolean;
        readonly isPasswordUpdated: boolean;
    }>;

}
