import {
    BaseEntityField, BaseInfoCompProps,
} from '.';
import {
    BaseInfoCompActionsSet, BaseInfoCompSaveAction,
} from './baseInfoCompInterfaces';


/**
 * This is the interface of the set of input fields' values that will be passed to the onClick handler when the 'saveUpdate' button is clicked.
 */
export interface BaseProjectInfoUpdatableInputs {
    readonly language?: string | undefined;
    readonly theme?: string | undefined;
}


/**
 * This component has a custom saveUpdate button's onClick input params therefore we need to extends the BaseInfoCompActionsSet and
 * override the 'saveUpdate' action.
 */
export interface BaseProjectInfoActionsSet extends BaseInfoCompActionsSet {
    readonly saveUpdate: BaseInfoCompSaveAction<BaseProjectInfoUpdatableInputs>
}

export interface BaseProjectInfoProps extends BaseInfoCompProps {
    readonly fields: {
        readonly id: BaseEntityField<number>;
        readonly name: BaseEntityField<string>;
        readonly description: BaseEntityField<string>;
        readonly type: BaseEntityField<string>;
        readonly language: BaseEntityField<string>;
        readonly theme: BaseEntityField<string>;
    }

    readonly actions?: BaseProjectInfoActionsSet | undefined;
}
