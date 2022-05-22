import {
    BaseEntityField, BaseInfoCompProps,
} from '.';
import {
    BaseInfoCompActionsSet, BaseInfoCompSaveAction,
} from './baseInfoCompInterfaces';


/**
 * This is the interface of the set of input fields' values that will be passed to the onClick handler when the 'saveUpdate' button is clicked.
 */
export interface BaseMyAgentAccountInfoUpdatableInputs {
    readonly name?: string | undefined;
    readonly email?: string | undefined;
    readonly confirmEmail?: string | undefined;
    readonly language?: string | undefined;
    readonly currentPassword?: string | undefined;
    readonly newPassword?: string | undefined;
    readonly confirmPassword?: string | undefined;
    readonly activateCode?: string | undefined;
}


/**
 * This component has a custom saveUpdate button's onClick input params therefore we need to extends the BaseInfoCompActionsSet and
 * override the 'saveUpdate' action.
 */
export interface BaseMyAgentAccountInfoActionsSet extends BaseInfoCompActionsSet {
    readonly saveUpdate: BaseInfoCompSaveAction<BaseMyAgentAccountInfoUpdatableInputs>
}


export interface BaseMyAgentAccountInfoProps extends BaseInfoCompProps {
    readonly fields: {
        readonly id: BaseEntityField<number>;
        readonly name: BaseEntityField<string>;
        readonly email: BaseEntityField<string>;
        readonly confirmEmail: BaseEntityField<string>;
        readonly language: BaseEntityField<string>;
        readonly currentPassword: BaseEntityField<string>;
        readonly newPassword: BaseEntityField<string>;
        readonly confirmPassword: BaseEntityField<string>;
        readonly activateCode: BaseEntityField<string>;
        readonly creationTime: BaseEntityField<string>;
    }

    readonly actions?: BaseMyAgentAccountInfoActionsSet | undefined;
}
