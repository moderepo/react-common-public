import {
    addHomeMember, ExtDispatch, UserAppDataStateAction,
} from '@moderepo/mode-data-state-user-app';
import {
    MemberRole,
} from '@moderepo/mode-apis';
import {
    BaseCompInputErrors,
} from '../..';
import {
    BaseHomeMemberInfoUpdatableInputs,
} from '../../componentInterfaces';
import {
    BaseHomeMemberCompCtrl,
    HomeMemberInfoInputErrors,
    HomeMemberInfoInputErrorType,
} from '../BaseHomeMemberCompCtrl';


export class FluxDSHomeMemberCompCtrl extends BaseHomeMemberCompCtrl {

    private dispatch: ExtDispatch<UserAppDataStateAction>;

    constructor (dispatch: ExtDispatch<UserAppDataStateAction>) {
        super();
        this.dispatch = dispatch;
    }

    /**
     * Add a home member by email
     */
    public async addHomeMemberByEmail (
        inputs: BaseHomeMemberInfoUpdatableInputs,
        homeId: number,
        validationParams: {
            emailFormat: RegExp,
        },
    ): Promise<void> {
        const newInputErrors: HomeMemberInfoInputErrors = ({
        });
        const { email, role } = inputs;


        // Validate inputs
        if (!email) {
            newInputErrors.email = {
                type: HomeMemberInfoInputErrorType.EMPTY_EMAIL,
            };
        } else if (!validationParams.emailFormat.test(email)) {
            newInputErrors.email = {
                type      : HomeMemberInfoInputErrorType.INVALID_EMAIL,
                inputValue: email,
            };
        }

        if (!role) {
            newInputErrors.role = {
                type: HomeMemberInfoInputErrorType.EMPTY_MEMBER_ROLE,
            };
        } else if (role !== MemberRole.MEMBER && role !== MemberRole.OWNER) {
            newInputErrors.role = {
                type      : HomeMemberInfoInputErrorType.INVALID_MEMBER_ROLE,
                inputValue: role,
            };
        }


        const hasError = Object.keys(newInputErrors).length > 0;

        if (!hasError && email && role) {
            try {
                // dispatch an action to update the user name and/or password
                await this.dispatch(addHomeMember(homeId, {
                    email, role,
                }));
                Promise.resolve();
            } catch (error) {
                return Promise.reject({
                    apiError: error,
                } as BaseCompInputErrors);
            }
        }


        // Dispatch errors to the container
        return Promise.reject(newInputErrors);
    }



    /**
     * Add a home member by email
     */
    public async addHomeMemberByPhoneNumber (
        inputs: BaseHomeMemberInfoUpdatableInputs,
        homeId: number,
    ): Promise<void> {
        const newInputErrors: HomeMemberInfoInputErrors = ({
        });
        const { phoneNumber, role } = inputs;


        // Validate inputs
        if (!phoneNumber) {
            newInputErrors.phoneNumber = {
                type: HomeMemberInfoInputErrorType.EMPTY_PHONE_NUMBER,
            };
        }

        if (!role) {
            newInputErrors.role = {
                type: HomeMemberInfoInputErrorType.EMPTY_MEMBER_ROLE,
            };
        } else if (role !== MemberRole.MEMBER && role !== MemberRole.OWNER) {
            newInputErrors.role = {
                type      : HomeMemberInfoInputErrorType.INVALID_MEMBER_ROLE,
                inputValue: role,
            };
        }


        const hasError = Object.keys(newInputErrors).length > 0;

        if (!hasError && phoneNumber && role) {
            try {
                // dispatch an action to update the user name and/or password
                await this.dispatch(addHomeMember(homeId, {
                    phoneNumber, role,
                }));
                Promise.resolve();
            } catch (error) {
                return Promise.reject({
                    apiError: error,
                } as BaseCompInputErrors);
            }
        }


        // Dispatch errors to the container
        return Promise.reject(newInputErrors);
    }
}
