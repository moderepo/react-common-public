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
export enum UserInfoInputErrorType {
    EMPTY_NAME = 'empty name',                          // When name is not provided
    EMPTY_EMAIL = 'empty email',                        // When email is not provided
    INVALID_EMAIL = 'invalid email',                    // When email is invalid
    EMPTY_PASSWORD = 'empty password',                  // When password is not provided
    EMPTY_CONFIRM_PASSWORD = 'empty confirm password',  // When confirm password is not provided
    PASSWORD_MISMATCH = 'password mismatch',            // When confirm password does not match password
    EMPTY_PHONE_NUMBER = 'empty phone number',          // When phone number is not provided
}



/**
 * This is the set of ACTUAL errors that can happen to the input field. The name of the errors should match the name of the fields to make errors
 * easier to handle. The value for the errors is an Object that has the type of error for the input and the 'inputValue' is the user's input value.
 */
export interface UserInfoInputErrors extends BaseCompInputErrors {
    name?: {
        type: UserInfoInputErrorType.EMPTY_NAME;
        inputValue?: string | undefined;
    };
    email?: {
        type: UserInfoInputErrorType.EMPTY_EMAIL | UserInfoInputErrorType.INVALID_EMAIL;
        inputValue?: string | undefined;
    };
    password?: {
        type: UserInfoInputErrorType.EMPTY_PASSWORD;
        inputValue?: string | undefined;
    };
    confirmPassword?: {
        type: UserInfoInputErrorType.EMPTY_CONFIRM_PASSWORD | UserInfoInputErrorType.PASSWORD_MISMATCH;
        inputValue?: string | undefined;
    };
    phoneNumber?: {
        type: UserInfoInputErrorType.EMPTY_PHONE_NUMBER;
        inputValue?: string | undefined;
    };
}


/**
 * This is the BaseController for all logic related to User. It is an ABSTRACT class because there is a few function that need to be implemented
 * by specific controller. This class does not know how to make API call so it can not implement those functions.
 */
export abstract class BaseUserAdminCompCtrl extends BaseCompCtrl {

    public abstract createEmailAccount (
        inputs: BaseUserInfoUpdatableInputs,
        projectId: number,
        inputValidation: {
            readonly emailFormat: RegExp,
        },
    ): Promise<{
        readonly success: boolean;
    }>;


    public abstract createPhoneAccount (
        inputs: BaseUserInfoUpdatableInputs,
        projectId: number,
    ): Promise<{
        readonly success: boolean;
    }>;


    public abstract updateUser (
        inputs: BaseUserInfoUpdatableInputs,
        currentUser: User,
    ): Promise<{
        readonly isDataModified: boolean
    }>;
}
