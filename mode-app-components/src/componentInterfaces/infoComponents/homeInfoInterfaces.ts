import {
    BaseEntityField, BaseInfoCompProps,
} from '.';
import {
    BaseInfoCompActionsSet, BaseInfoCompSaveAction,
} from './baseInfoCompInterfaces';


/**
 * This is the interface of the set of input fields' values that will be passed to the onClick handler when the 'saveUpdate' button is clicked.
 */
export interface BaseHomeInfoUpdatableInputs {
    readonly name?: string | undefined;
    readonly deactivated?: boolean | undefined;
}


/**
 * This component has a custom saveUpdate button's onClick input params therefore we need to extends the BaseInfoCompActionsSet and
 * override the 'saveUpdate' action.
 */
export interface BaseHomeInfoActionsSet extends BaseInfoCompActionsSet {
    readonly saveUpdate: BaseInfoCompSaveAction<BaseHomeInfoUpdatableInputs>
}


export interface BaseHomeInfoProps extends BaseInfoCompProps {
    readonly fields: {
        readonly id?: BaseEntityField<number>;
        readonly name: BaseEntityField<string>;
        readonly deactivated?: BaseEntityField<boolean>;
        readonly creationTime?: BaseEntityField<string>;
    }

    readonly actions?: BaseHomeInfoActionsSet | undefined;
}
