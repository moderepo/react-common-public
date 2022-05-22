import {
    ExtDispatch, updateUserProfile, UserAppDataStateAction,
} from '@moderepo/mode-data-state-user-app';
import {
    User,
} from '@moderepo/mode-apis';
import {
    BaseCompInputErrors,
} from '../..';
import {
    BaseUserInfoUpdatableInputs,
} from '../../componentInterfaces';
import {
    BaseMyAccountCompCtrl, MyAccountInfoInputErrorType, MyAccountInfoInputErrors,
} from '../BaseMyAccountCompCtrl';



export class FluxDSMyAccountCompCtrl extends BaseMyAccountCompCtrl {

    private dispatch: ExtDispatch<UserAppDataStateAction>;

    constructor (dispatch: ExtDispatch<UserAppDataStateAction>) {
        super();
        this.dispatch = dispatch;
    }


    /**
     * Update the logged in user account
     * @returns isDataModified - A flag to indicate whether the data changed. Sometime the user click save without changing anything.
     * @returns isPasswordUpdated - A flag to indicate if the password changed. The handler might handle the event differently e.g. log the user out
     */
    public async updateMyAccount (
        inputs: BaseUserInfoUpdatableInputs,
        currentUser: User,
    ): Promise<{
            readonly isDataModified: boolean;
            readonly isPasswordUpdated: boolean;
        }> {

        const newInputErrors: MyAccountInfoInputErrors = ({
        });
        const { name, password, confirmPassword } = inputs;

        // Validate inputs
        if (!name) {
            newInputErrors.name = {
                type: MyAccountInfoInputErrorType.EMPTY_NAME,
            };
        }

        // Password is OPTIONAL but if password is set then we also need to validate it and need to validate confirm password
        if (password) {
            if (!confirmPassword) {
                newInputErrors.confirmPassword = {
                    type      : MyAccountInfoInputErrorType.EMPTY_CONFIRM_PASSWORD,
                    inputValue: confirmPassword,
                };
            } else if (confirmPassword !== password) {
                newInputErrors.confirmPassword = {
                    type      : MyAccountInfoInputErrorType.PASSWORD_MISMATCH,
                    inputValue: confirmPassword,
                };
            }
        }


        const hasError = Object.keys(newInputErrors).length > 0;

        if (!hasError && (name || password)) {
            // Inputs validated successfully
            if (name !== currentUser.name || password) {
                try {
                    // dispatch an action to update the user name and/or password
                    await this.dispatch(updateUserProfile(currentUser.id, {
                        name    : name !== currentUser.name ? name : undefined,
                        password: password || undefined,
                    }));

                    return {
                        isDataModified   : true,
                        isPasswordUpdated: Boolean(password),
                    };
                } catch (error) {
                    return Promise.reject({
                        apiError: error,
                    } as BaseCompInputErrors);
                }
            }

            // newName is the same and no new password so no need to make api call
            return {
                isDataModified   : false,
                isPasswordUpdated: false,
            };
        }


        // Dispatch errors to the container
        return Promise.reject(newInputErrors);
    }
}
