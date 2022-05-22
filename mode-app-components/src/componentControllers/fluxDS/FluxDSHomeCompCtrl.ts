import {
    createHome,
    ExtDispatch, updateHome, UserAppDataStateAction,
} from '@moderepo/mode-data-state-user-app';
import {
    Home,
} from '@moderepo/mode-apis';
import {
    BaseCompInputErrors, BaseHomeInfoUpdatableInputs,
} from '../..';
import {
    BaseHomeCompCtrl, HomeInfoInputErrorType, HomeInfoInputErrors,
} from '../BaseHomeCompCtrl';



export class FluxDSHomeCompCtrl extends BaseHomeCompCtrl {
    private dispatch: ExtDispatch<UserAppDataStateAction>;

    constructor (dispatch: ExtDispatch<UserAppDataStateAction>) {
        super();
        this.dispatch = dispatch;
    }


    /**
     * Update an existing Home
     * @returns isDataModified - A flag to indicate whether the data changed. Sometime the user click save without changing anything.
     */
    public async updateHomeInfo (
        inputs: BaseHomeInfoUpdatableInputs,
        currentHome: Home,
    ): Promise<{
            readonly isDataModified: boolean
        }> {
        const newInputErrors: HomeInfoInputErrors = ({
        });
        const { name } = inputs;

        // Validate inputs
        if (!name) {
            newInputErrors.name = {
                type: HomeInfoInputErrorType.EMPTY_NAME,
            };
        }

        const hasError = Object.keys(newInputErrors).length > 0;

        if (!hasError && name) {
            // Inputs validated successfully
            if (name !== currentHome.name) {
                try {
                    // dispatch an action to update the user name and/or password
                    await this.dispatch(updateHome(currentHome.id, name));

                    return {
                        isDataModified: true,
                    };
                } catch (error) {
                    return Promise.reject({
                        apiError: error,
                    } as BaseCompInputErrors);
                }
            }

            // newName is the same and no new password so no need to make api call
            return {
                isDataModified: false,
            };
        }


        // Dispatch errors to the container
        return Promise.reject(newInputErrors);
    }


    /**
     * Create a new home
     */
    public async createHomeForUser (
        inputs: BaseHomeInfoUpdatableInputs,
    ): Promise<boolean> {
        const newInputErrors: HomeInfoInputErrors = ({
        });
        const { name } = inputs;

        // Validate inputs
        if (!name) {
            newInputErrors.name = {
                type: HomeInfoInputErrorType.EMPTY_NAME,
            };
        }

        const hasError = Object.keys(newInputErrors).length > 0;

        if (!hasError && name) {
            try {
                // dispatch an action to update the user name and/or password
                await this.dispatch(createHome(name));
                return true;
            } catch (error) {
                Promise.reject({
                    apiError: error,
                } as BaseCompInputErrors);
            }
        }


        // Dispatch errors to the container
        return Promise.reject(newInputErrors);
    }
}
