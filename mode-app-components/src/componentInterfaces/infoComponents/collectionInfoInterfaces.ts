import {
    BaseEntityField, BaseInfoCompProps, BaseInfoCompSaveAction,
} from '.';
import {
    BaseInfoCompActionsSet,
} from './baseInfoCompInterfaces';


export interface BaseCollectionInfoActionsSet extends BaseInfoCompActionsSet {
    readonly saveUpdate: BaseInfoCompSaveAction<{
        readonly id?: string | undefined;
        readonly homeId?: number | undefined;
        readonly moduleId?: string | undefined;
        readonly timeZone?: string | undefined;
        readonly valueNames?: string[] | undefined;
        readonly tagNames?: string[] | undefined;
        readonly startDate?: string | undefined;
        readonly endDate?: string | undefined;
    }>
}


export interface BaseCollectionInfoProps extends BaseInfoCompProps {
    readonly fields: {
        readonly id?: BaseEntityField<string>;
        readonly homeId?: BaseEntityField<number>;
        readonly moduleId?: BaseEntityField<string>;
        readonly timeZone?: BaseEntityField<string>;
        readonly valueNames?: BaseEntityField<readonly string[]>;
        readonly tagNames?: BaseEntityField<readonly string[]>;
        readonly startDate?: BaseEntityField<string>;
        readonly endDate?: BaseEntityField<string>;
    }

    readonly actions?: BaseCollectionInfoActionsSet;
}
