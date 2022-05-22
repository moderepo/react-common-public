import {
    BaseEntityField, BaseInfoCompProps,
} from '.';
import {
    BaseInfoCompActionsSet, BaseInfoCompSaveAction,
} from './baseInfoCompInterfaces';


/**
 * This is the interface of the set of input fields' values that will be passed to the onClick handler when the 'saveUpdate' button is clicked.
 */
export interface BaseDeviceInfoUpdatableInputs {
    readonly deviceClass?: string | undefined;
    readonly name?: string | undefined;
    readonly tag?: string | undefined;
    readonly claimCode?: string | undefined;
}


/**
 * This component has a custom saveUpdate button's onClick input params therefore we need to extends the BaseInfoCompActionsSet and
 * override the 'saveUpdate' action.
 */
export interface BaseDeviceInfoActionsSet extends BaseInfoCompActionsSet {
    readonly saveUpdate: BaseInfoCompSaveAction<BaseDeviceInfoUpdatableInputs>
}


export interface BaseDeviceInfoProps extends BaseInfoCompProps {
    readonly fields: {
        readonly id?: BaseEntityField<number>;
        readonly deviceClass?: BaseEntityField<string>;
        readonly name?: BaseEntityField<string>;
        readonly tag?: BaseEntityField<string>;
        readonly firmware?: BaseEntityField<string>;
        readonly bundleInstalled?: BaseEntityField<string>;
        readonly bundleInstallTime?: BaseEntityField<string>;
        readonly claimTime?: BaseEntityField<string>;
        readonly isConnected: BaseEntityField<boolean>;
        readonly connectedTime: BaseEntityField<string>;
        readonly homeId: BaseEntityField<number>;
        readonly claimCode: BaseEntityField<string>;
        readonly apiKey: BaseEntityField<string>;
    };

    readonly actions?: BaseDeviceInfoActionsSet | undefined;
}
