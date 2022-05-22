import {
    BaseEntityField, BaseInfoCompProps,
} from '.';
import {
    BaseInfoCompActionsSet, BaseInfoCompSaveAction,
} from './baseInfoCompInterfaces';


/**
 * This is the interface of the set of input fields' values that will be passed to the onClick handler when the 'saveUpdate' button is clicked.
 */
export interface BaseKVPairInfoUpdatableInputs {
    readonly key?: string | undefined;
    readonly value?: string | undefined;
}


/**
 * This component has a custom saveUpdate button's onClick input params therefore we need to extends the BaseInfoCompActionsSet and
 * override the 'saveUpdate' action.
 */
export interface BaseKVPairInfoActionsSet extends BaseInfoCompActionsSet {
    readonly saveUpdate: BaseInfoCompSaveAction<BaseKVPairInfoUpdatableInputs>
}

export interface BaseKVPairInfoProps extends BaseInfoCompProps {
    readonly fields: {
        readonly key?: BaseEntityField<string>;
        readonly value?: BaseEntityField<string>;
        readonly modificationTime?: BaseEntityField<string>;
    }

    readonly actions?: BaseKVPairInfoActionsSet | undefined;
}
