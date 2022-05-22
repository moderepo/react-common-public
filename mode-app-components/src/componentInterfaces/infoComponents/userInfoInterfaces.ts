import {
    BaseEntityField,
} from '..';
import {
    BaseInfoCompProps,
} from '.';
import {
    BaseInfoCompActionsSet, BaseInfoCompSaveAction,
} from './baseInfoCompInterfaces';



/**
 * This is the interface of the set of input fields' values that will be passed to the onClick handler when the 'saveUpdate' button is clicked.
 */
export interface BaseUserInfoUpdatableInputs {
    readonly name?: string | undefined;
    readonly email?: string | undefined;
    readonly password?: string | undefined;
    readonly confirmPassword?: string | undefined;
    readonly phoneNumber?: string | undefined;
}


/**
 * This component has a custom saveUpdate button's onClick input params therefore we need to extends the BaseInfoCompActionsSet and
 * override the 'saveUpdate' action.
 */
export interface BaseUserInfoActionsSet extends BaseInfoCompActionsSet {
    readonly saveUpdate: BaseInfoCompSaveAction<BaseUserInfoUpdatableInputs>
}


/**
 * This is the interface for a UserInfoComp's props. All UserInfoUI components will need to have at least these props. If anyone want to
 * create custom UserInfoComp, they can extends this props interface if they needed to.
 */
export interface BaseUserInfoProps extends BaseInfoCompProps {
    /**
     * Fields for displaying user info
     */
    readonly fields: {
        readonly verified?: BaseEntityField<boolean> | undefined;
        readonly id?: BaseEntityField<number> | undefined;
        readonly name: BaseEntityField<string> | undefined;
        readonly email?: BaseEntityField<string> | undefined;
        readonly password?: BaseEntityField<string> | undefined;
        readonly confirmPassword?: BaseEntityField<string> | undefined;
        readonly phoneNumber?: BaseEntityField<string> | undefined;
        readonly creationTime?: BaseEntityField<string> | undefined;
    }

    readonly actions?: BaseUserInfoActionsSet | undefined;
}
