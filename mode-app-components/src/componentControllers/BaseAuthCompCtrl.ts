import {
    User, UserLoginInfo,
} from '@moderepo/mode-apis';
import {
    BaseCompInputErrors, EmailLoginFormInputField,
} from '..';
import {
    ActivateAccountFormInputField, ResetPasswordFormInputField, StartResetPasswordFormInputField,
} from '../componentInterfaces';
import {
    BaseCompCtrl,
} from './BaseCompCtrl';


/**
 * The types of input error that can happen to the input field
 */
export enum EmailLoginFormErrorType {
    EMPTY_EMAIL = 'empty email',                        // When email is not provided
    INVALID_EMAIL = 'invalid email',                    // When email address is not valid
    EMPTY_PASSWORD = 'empty password',                  // When password is not provided
}


/**
 * The types of input error that can happen to the input field
 */
export enum StartResetPasswordFormErrorType {
    EMPTY_EMAIL = 'empty email',
    INVALID_EMAIL = 'invalid email',
}


/**
 * The types of input error that can happen to the input field
 */
export enum ResetPasswordFormErrorType {
    EMPTY_PASSWORD = 'empty new password',
    EMPTY_CONFIRM_PASSWORD = 'empty confirm password',
    PASSWORDS_MISMATCH = 'passwords mismatch',
}


/**
 * The types of input error that can happen to the input field
 */
export enum ActivateAccountFormErrorType {
    EMPTY_NAME = 'empty name',
    EMPTY_PASSWORD = 'empty new password',
    EMPTY_CONFIRM_PASSWORD = 'empty confirm password',
    PASSWORDS_MISMATCH = 'passwords mismatch',
}



/**
 * This is the set of ACTUAL errors that can happen to the input field. The name of the errors should match the name of the fields to make errors
 * easier to handle. The value for the errors is an Object that has the type of error for the input and the 'inputValue' is the user's input value.
 */
export interface EmailLoginFormInputErrors extends BaseCompInputErrors {
    [EmailLoginFormInputField.EMAIL]?: {
        type: EmailLoginFormErrorType.EMPTY_EMAIL | EmailLoginFormErrorType.INVALID_EMAIL;
        inputValue?: string | undefined;
    };
    [EmailLoginFormInputField.PASSWORD]?: {
        type: EmailLoginFormErrorType.EMPTY_PASSWORD;
        inputValue?: string | undefined;
    };
}


/**
 * This is the set of ACTUAL errors that can happen to the input field. The name of the errors should match the name of the fields to make errors
 * easier to handle. The value for the errors is an Object that has the type of error for the input and the 'inputValue' is the user's input value.
 */
export interface StartResetPasswordFormInputErrors extends BaseCompInputErrors {
    [StartResetPasswordFormInputField.EMAIL]?: {
        type: StartResetPasswordFormErrorType.EMPTY_EMAIL | StartResetPasswordFormErrorType.INVALID_EMAIL;
        inputValue?: string | undefined;
    };
}



/**
 * This is the set of ACTUAL errors that can happen to the input field. The name of the errors should match the name of the fields to make errors
 * easier to handle. The value for the errors is an Object that has the type of error for the input and the 'inputValue' is the user's input value.
 */

export interface ResetPasswordFormInputErrors extends BaseCompInputErrors {
    [ResetPasswordFormInputField.NEW_PASSWORD]?: {
        type: ResetPasswordFormErrorType.EMPTY_PASSWORD;
        inputValue?: string | undefined;
    };
    [ResetPasswordFormInputField.CONFIRM_NEW_PASSWORD]?: {
        type: ResetPasswordFormErrorType.EMPTY_CONFIRM_PASSWORD | ResetPasswordFormErrorType.PASSWORDS_MISMATCH;
        inputValue?: string | undefined;
    };
}


/**
 * This is the set of ACTUAL errors that can happen to the input field. The name of the errors should match the name of the fields to make errors
 * easier to handle. The value for the errors is an Object that has the type of error for the input and the 'inputValue' is the user's input value.
 */
export interface ActivateAccountFormInputErrors extends BaseCompInputErrors {
    [ActivateAccountFormInputField.NAME]?: {
        type: ActivateAccountFormErrorType.EMPTY_NAME;
        inputValue?: string | undefined;
    };
    [ActivateAccountFormInputField.PASSWORD]?: {
        type: ActivateAccountFormErrorType.EMPTY_PASSWORD;
        inputValue?: string | undefined;
    };
    [ActivateAccountFormInputField.CONFIRM_PASSWORD]?: {
        type: ActivateAccountFormErrorType.EMPTY_CONFIRM_PASSWORD | ActivateAccountFormErrorType.PASSWORDS_MISMATCH;
        inputValue?: string | undefined;
    };
}



/**
 * This is the BaseController for all logic related to Login. It is an ABSTRACT class because there is a few function that need to be implemented
 * by specific controller. This class does not know how to make API call so it can not implement those functions.
 */
export abstract class BaseAuthCompCtrl extends BaseCompCtrl {

    public abstract loginByEmail (
        inputs: {
            readonly email?: string | undefined;
            readonly password?: string | undefined;
        },
        projectId: number,
        appId: string,
        inputValidation: {
            readonly emailFormat: RegExp
        },
    ): Promise<{
        readonly loginInfo: UserLoginInfo,
        readonly user: User
    }>;



    /**
     * Start the reset password process for the specified email
     *
     * This function will reject with error of type StartResetPasswordCompInputErrors if email/password are not valid or if API call failed
     *
     * @param email
     * @param password
     */
    public abstract startResetPassword (
        inputs: {
            readonly email?: string | undefined;
        },
        projectId: number,
        inputValidation: {
            readonly emailFormat: RegExp
        },
    ): Promise<boolean>;



    /**
     * Start the reset password process for the specified email
     *
     * This function will reject with error of type ResetPasswordCompInputErrors if email/password are not valid or if API call failed
     *
     * @param email
     * @param password
     */
    public abstract resetPassword (
        inputs: {
            readonly newPassword?: string | undefined;
            readonly confirmNewPassword?: string | undefined;
        },
        token: string,

    ): Promise<boolean>;


    /**
     * Activate a new user account
     *
     * This function will reject with error of type ActivateAccountCompInputErrors if inputs are not valid or if API call failed
     *
     * @param token
     * @param name
     * @param password
     * @param confirmPassword
     */
    public abstract activateUserAccount (
        inputs: {
            readonly name?: string | undefined;
            readonly password?: string | undefined;
            readonly confirmPassword?: string | undefined;
        },
        token: string,
    ): Promise<boolean>;
}
