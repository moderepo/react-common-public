import {
    ExtDispatch, authenticateSuccess, UserAppDataStateAction,
} from '@moderepo/mode-data-state-user-app';
import {
    UserLoginInfo, User, AppAPI,
} from '@moderepo/mode-apis';
import {
    BaseCompInputErrorType, EmailLoginFormErrorType, ResetPasswordFormErrorType, StartResetPasswordFormErrorType, BaseCompInputErrors,
} from '../..';
import {
    ActivateAccountFormErrorType, ActivateAccountFormInputErrors, BaseAuthCompCtrl, EmailLoginFormInputErrors, ResetPasswordFormInputErrors,
    StartResetPasswordFormInputErrors,
} from '../BaseAuthCompCtrl';


/**
 * This is the controller for all Auth related API calls e.g. login, resetPassword, updateProfile, etc...
 */
export class FluxDSAuthCompCtrl extends BaseAuthCompCtrl {

    private dispatch: ExtDispatch<UserAppDataStateAction>;

    private appAPI: AppAPI;

    constructor (dispatch: ExtDispatch<UserAppDataStateAction>) {
        super();
        this.dispatch = dispatch;
        this.appAPI = AppAPI.getInstance();
    }


    /**
     * Log the user in with the specified email and password. Return an object with 2 fields if successful.
     *      {
     *          readonly loginInfo: UserLoginInfo,
     *          readonly user: User
     *      }
     *
     * This function will reject with error of type EmailLoginInputErrors if email/password are not valid or if API call failed
     *
     * @param email
     * @param password
     */
    public async loginByEmail (
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
        }> {
        const { email, password } = inputs;

        // Create a new input errors object. We will validate the inputs and if an input contain error, we will add error message to this object
        const newInputErrors: EmailLoginFormInputErrors = {
        };

        // Validate inputs
        if (!email) {
            newInputErrors.email = {
                type: EmailLoginFormErrorType.EMPTY_EMAIL,
            };
        } else if (!inputValidation.emailFormat.test(email)) {
            newInputErrors.email = {
                type: EmailLoginFormErrorType.INVALID_EMAIL, inputValue: email,
            };
        }

        if (!password) {
            newInputErrors.password = {
                type: EmailLoginFormErrorType.EMPTY_PASSWORD,
            };
        }

        const hasError = Object.keys(newInputErrors).length > 0;
        if (!hasError && email && password) {
            // If no error, make API call
            try {
                // First log the user in
                const loginInfo = await this.appAPI.login(projectId, appId, email, password);

                // If login successful and we have the token, call authenticateUser to get the user's profile data
                const userProfile = await this.appAPI.getUserById(loginInfo.userId);
                await this.dispatch(authenticateSuccess(userProfile));
                return {
                    loginInfo,
                    user: userProfile,
                };
            } catch (error) {
                // Get the error message based on the error code
                return Promise.reject({
                    apiError: {
                        type: BaseCompInputErrorType.API_CALL,
                        error,
                    },
                } as BaseCompInputErrors);
            }
        }

        return Promise.reject(newInputErrors);
    }



    /**
     * Start the reset password process for the specified email
     *
     * This function will reject with error of type EmailLoginInputErrors if email/password are not valid or if API call failed
     *
     * @param email
     * @param password
     */
    public async startResetPassword (
        inputs: {
            readonly email?: string | undefined;
        },
        projectId: number,
        inputValidation: {
            readonly emailFormat: RegExp
        },
    ): Promise<boolean> {
        const { email } = inputs;

        // Create a new input errors object. We will validate the inputs and if an input contain error, we will add error message to this object
        const newInputErrors: StartResetPasswordFormInputErrors = {
        };

        // Validate inputs
        if (!email) {
            newInputErrors.email = {
                type: StartResetPasswordFormErrorType.EMPTY_EMAIL,
            };
        } else if (!inputValidation.emailFormat.test(email)) {
            newInputErrors.email = {
                type      : StartResetPasswordFormErrorType.INVALID_EMAIL,
                inputValue: email,
            };
        }


        const hasError = Object.keys(newInputErrors).length > 0;
        if (!hasError && email) {
            try {
                // If no error, make API call
                await this.appAPI.resetPassword(projectId, email);
                return true;
            } catch (error) {
                return Promise.reject({
                    apiError: {
                        type: BaseCompInputErrorType.API_CALL,
                        error,
                    },
                } as BaseCompInputErrors);
            }
        }

        return Promise.reject(newInputErrors);
    }



    /**
     * Start the reset password process for the specified email
     *
     * This function will reject with error of type EmailLoginInputErrors if email/password are not valid or if API call failed
     *
     * @param email
     * @param password
     */
    public async resetPassword (
        inputs: {
            readonly newPassword?: string | undefined;
            readonly confirmNewPassword?: string | undefined;
        },
        token: string,

    ): Promise<boolean> {
        const { newPassword, confirmNewPassword } = inputs;

        // Create a new input errors object. We will validate the inputs and if an input contain error, we will add error message to this object
        const newInputErrors: ResetPasswordFormInputErrors = {
        };

        // Validate inputs
        if (!newPassword) {
            newInputErrors.newPassword = {
                type: ResetPasswordFormErrorType.EMPTY_PASSWORD,
            };
        }
        if (!confirmNewPassword) {
            newInputErrors.confirmNewPassword = {
                type: ResetPasswordFormErrorType.EMPTY_CONFIRM_PASSWORD,
            };
        }
        if (newPassword && confirmNewPassword && newPassword !== confirmNewPassword) {
            newInputErrors.confirmNewPassword = {
                type      : ResetPasswordFormErrorType.PASSWORDS_MISMATCH,
                inputValue: confirmNewPassword,
            };
        }

        const hasError = Object.keys(newInputErrors).length > 0;
        if (!hasError && newPassword) {
            try {
                // If no error, make API call
                await this.appAPI.completeResetPassword(token, newPassword);
                return true;
            } catch (error) {
                return Promise.reject({
                    apiError: {
                        type: BaseCompInputErrorType.API_CALL,
                        error,
                    },
                } as BaseCompInputErrors);
            }
        }
        return Promise.reject(newInputErrors);
    }



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
    public async activateUserAccount (
        inputs: {
            readonly name?: string | undefined;
            readonly password?: string | undefined;
            readonly confirmPassword?: string | undefined;
        },
        token: string,
    ): Promise<boolean> {
        const { name, password, confirmPassword } = inputs;

        // Create a new input errors object. We will validate the inputs and if an input contain error, we will add error message to this object
        const newInputErrors: ActivateAccountFormInputErrors = {
        };

        // Validate inputs
        if (!name) {
            newInputErrors.name = {
                type: ActivateAccountFormErrorType.EMPTY_NAME,
            };
        }
        if (!password) {
            newInputErrors.password = {
                type: ActivateAccountFormErrorType.EMPTY_PASSWORD,
            };
        }
        if (!confirmPassword) {
            newInputErrors.confirmPassword = {
                type: ActivateAccountFormErrorType.EMPTY_CONFIRM_PASSWORD,
            };
        }
        if (password && confirmPassword && password !== confirmPassword) {
            newInputErrors.confirmPassword = {
                type      : ActivateAccountFormErrorType.PASSWORDS_MISMATCH,
                inputValue: confirmPassword,
            };
        }

        const hasError = Object.keys(newInputErrors).length > 0;
        if (!hasError && name && password) {
            try {
                // If no error, make API call
                await this.appAPI.activateAccount(token, name, password);
                return true;
            } catch (error) {
                return Promise.reject({
                    apiError: {
                        type: BaseCompInputErrorType.API_CALL,
                        error,
                    },
                } as BaseCompInputErrors);
            }
        }
        return Promise.reject(newInputErrors);
    }
}
