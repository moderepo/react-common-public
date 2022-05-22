import {
    MemberRole,
} from '@moderepo/mode-apis';
import {
    BaseEntityField, BaseInfoCompProps,
} from '.';
import {
    BaseInfoCompActionsSet, BaseInfoCompSaveAction,
} from './baseInfoCompInterfaces';


/**
 * This is the interface of the set of input fields' values that will be passed to the onClick handler when the 'saveUpdate' button is clicked.
 */
export interface BaseHomeMemberInfoUpdatableInputs {
    readonly email?: string | undefined;
    readonly phoneNumber?: string | undefined;
    readonly role?: MemberRole | undefined;
}


/**
 * This component has a custom saveUpdate button's onClick input params therefore we need to extends the BaseInfoCompActionsSet and
 * override the 'saveUpdate' action.
 */
export interface BaseHomeMemberInfoActionsSet extends BaseInfoCompActionsSet {
    readonly saveUpdate: BaseInfoCompSaveAction<BaseHomeMemberInfoUpdatableInputs>
}


export interface BaseHomeMemberInfoProps extends BaseInfoCompProps {
    readonly fields: {
        readonly verified?: BaseEntityField<boolean>;
        readonly userId?: BaseEntityField<number>;
        readonly name?: BaseEntityField<string>;
        readonly email?: BaseEntityField<string>;
        readonly phoneNumber?: BaseEntityField<string>;
        readonly role?: BaseEntityField<MemberRole>;
        readonly creationTime?: BaseEntityField<string>;
    }

    readonly actions?: BaseHomeMemberInfoActionsSet | undefined;
}
