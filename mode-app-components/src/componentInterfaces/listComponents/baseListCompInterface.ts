import {
    SortOrder,
} from '@moderepo/mode-apis';
import {
    BaseCompProps,
} from '../baseCompInterfaces';



/**
 * The BASE Setting structure for 1 field. This interface defines the most common props that most list field have. If a component needs additional
 * props, it can extends this interface.
 *
 * @param dataItemProp - The prop name of the actual data item object. Sometime the field's key doesn't match the data 's prop name
 *              because we want to give the field some different key. The field's key can be anything but this 'dataItemProp' must be a valid key
 *              from one of the data object's props. When we sort data, this is the key that we will be using to get the data's props value.
 * @param label - the field label to be displayed. This is usually the same as key but it can be different.
 * @param unit - OPTIONAL - the field value unit.
 * @param sortable - OPTIONAL - If the field is sortable.
 * @private hidden - OPTIONAL - If the field is hidden.
 */
export interface BaseListCompField {
    readonly dataItemProp?: string | undefined;
    readonly label: string;
    readonly unit?: string;
    readonly sortable?: boolean;
    readonly hidden?: boolean;
}



/**
 * The structure of BASE list fields set. This should be a map of field key => FieldSettings. This
 * structure does not define the list of field keys. Each specific list will need to define the set since
 * only it knows what fields it needs. As long as the config contains a set of key:string => value: FieldSettings
 * and they are good.
 */
export interface BaseListCompFieldsSet {
    readonly remove?: BaseListCompField | undefined;
    readonly preview?: BaseListCompField | undefined;
}



/**
 * Structure for fields settings for a list. A fields settings will have a map of fields of type BaseListCompFieldsSet,
 * the current sorted fields and order, and a callback function for when a field is clicked.
 * NOTE that 'fields' is generic since this is a generic list settings. It does not know which fields
 * it needs to define. Each list that uses that structure need to define the set of fields.
 */
export interface BaseListCompFieldsSettings<T extends BaseListCompFieldsSet> {
    readonly fields: T;
    readonly currentSortedField?: string;
    readonly currentSortedOrder?: SortOrder;
    readonly onSortByField?: (field: BaseListCompField)=> void;
}


/**
 * The Base interface for a list data item. Each item must have an 'actualValue' which it the data that the list is showing and the 'displayValue'
 * which contains the formatted values for the actual value. 'displayValue' is optional because some actualData can be displayed as is and don't
 * need to be reformatted.
 */
export interface BaseListCompDataItem <T> {
    readonly actualValue: T;
    readonly displayValue?: object;
    readonly selected?: boolean;
    readonly canBeRemoved?: boolean;
}


/**
 * This is the Base interface for ALL components that display data in a list. This interface defines all the common props that most list
 * component has. Each specific component can extends this interface AND add their own additional props.
 */
export interface BaseListCompProps <T> extends BaseCompProps {
    readonly listData?: readonly BaseListCompDataItem<T>[] | undefined;
    readonly onListItemSelected?: (item: T)=> void;
    readonly onRemoveItemClicked?: (item: T)=> void;
    readonly onPreviewItemClicked?: (item: T)=> void;

    readonly fieldsSettings?: BaseListCompFieldsSettings<BaseListCompFieldsSet> | undefined;

    readonly paginationComp?: React.ReactNode;          // The OPTIONAL pagination component to show if the list has pagination

    // The OPTIONAL message to show when there is NO data, listData is null or undefined. This is usually the case when the data is not loaded
    readonly noDataMessageComp?: React.ReactNode;

    // The OPTIONAL message to show when listData is an empty array. This is the case when data is loaded but it is empty. Maybe there is no data
    // at all or maybe there is no data based on the current filters and pagination
    readonly emptyDataMessageComp?: React.ReactNode;
}
