import {
    ExtDispatch, updateHomeDevice, UserAppDataStateAction,
} from '@moderepo/mode-data-state-user-app';
import {
    HomeDevice,
} from '@moderepo/mode-apis';
import {
    BaseCompInputErrors,
} from '../..';
import {
    BaseDeviceInfoUpdatableInputs,
} from '../../componentInterfaces';
import {
    BaseDeviceCompCtrl,
} from '../BaseDeviceCompCtrl';


export class FluxDSDeviceCompCtrl extends BaseDeviceCompCtrl {

    protected dispatch: ExtDispatch<UserAppDataStateAction>;

    constructor (dispatch: ExtDispatch<UserAppDataStateAction>) {
        super();
        this.dispatch = dispatch;
    }


    /**
     * Update an existing Home Device. This helper function is used for End-User app
     * @returns isDataModified - A flag to indicate whether the data changed. Sometime the user click save without changing anything.
     */
    public async updateHomeDeviceInfo (
        inputs: BaseDeviceInfoUpdatableInputs,
        currentDevice: HomeDevice,
        homeId: number,
    ): Promise<{
            readonly isDataModified: boolean
        }> {

        // For Home Devices, the user can only update the name and tag and both are optional so there is no need to validate them
        const { name, tag } = inputs;

        // Inputs validated successfully. Make sure one of the input changed before making API call or else it will be called for nothing
        if (name !== currentDevice.name || tag !== currentDevice.tag) {
            try {
                // dispatch an action to update the user name and/or password
                await this.dispatch(updateHomeDevice(homeId, currentDevice.id, {
                    name, tag,
                }));

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

}
