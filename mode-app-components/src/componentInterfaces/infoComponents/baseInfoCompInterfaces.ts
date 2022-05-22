/**
 * This file defines the interfaces for UI Components that are used for displaying information about MODE's entities e.g. User, Device, Home, etc...
 * These components are only UI components without business logic. All they do is get data from props and display them. All logics will be handled
 * by the containers of these components.
 */

import {
    ApiError,
} from '@moderepo/mode-apis';
import {
    HTMLInputTypeAttribute,
} from 'react';
import {
    FieldInputType,
} from '../..';
import {
    BaseCompProps,
} from '../baseCompInterfaces';
import {
    BaseCompAction,
} from '../globalInterfaces';



/**
 * The base error type that all components can have.
 */
export enum BaseCompInputErrorType {
    API_CALL = 'api call',
}


/**
 * The ACTUAL error object that all component can have
 */
export interface BaseCompInputErrors {
    apiError?: {
        type: BaseCompInputErrorType.API_CALL;
        error?: ApiError | undefined;
    }
}


export interface SelectInputOption<T> {
    readonly label: string;
    readonly value: T;
    readonly icon?: string;
    readonly disabled?: boolean;
    readonly selected?: boolean;
}


export const isSelectInputOption = <T>(obj: unknown): obj is SelectInputOption<T> => {
    const option = obj as SelectInputOption<T>;
    return option !== undefined
        && (typeof option.label === 'string')
        && (!option.icon || typeof option.icon === 'string')
        && (option.disabled === undefined || typeof option.disabled === 'boolean')
        && (option.selected === undefined || typeof option.selected === 'boolean');
};


export interface BaseEntityField <T> {
    readonly label: string;
    readonly description?: string;
    readonly displayValue?: string;                         // The string version of the field value, only use for READONLY fields
    readonly editable?: boolean;                            // If the field can be changed by user
    readonly clickable?: boolean;                           // All input fields that are NOT editable will not be clickable UNLESS this is true
    readonly editingModeOnly?: boolean;                     // Only show this input field when in editing mode
    readonly hideOnEdit?: boolean;                          // Hide this input in Edit mode IF this field is no Editable. Default is FALSE.
    readonly variant?: 'filled' | 'outlined' | 'standard';  // The style of the field
    readonly hidden?: boolean;
    readonly multiple?: boolean;                            // Whether or not this input field allow the user to enter multiple values

    // These attributes are for EDITABLE fields
    readonly error?: string | undefined;                            // The error message to show for the input
    readonly placeholder?: string | undefined;                      // The string to be displayed in the input field
    readonly value?: T | undefined;                                 // The actual value of the input which can be any type.
    readonly required?: boolean | undefined;                        // Whether the field is required. Default is false.
    readonly options?: readonly SelectInputOption<T>[] | undefined; // Restricted list of options that are allowed for the field's value.
    readonly multipleSelectionDisplayLimit?: number | undefined;    // For inputs with 'multiple' selections, maximum number of item to display
    readonly noOptionsLabel?: string | undefined;                   // The label to show when there is no options
    readonly freeSolo?: boolean | undefined;                        // For AutoComplete inputs. Allow any input value that might not be in options

    // Most component will ignore these props because the component knows which type to use based on the field. E.g., the component knows
    // to use SELECT control type for Language field. The component knows to use TEXT control type with multiple lines for JSON input, etc...
    // These are mostly used for generic component which doesn't know anything about the fields and the type will be specified by the user.
    readonly controlType?: FieldInputType | undefined;          // The input control type to use e.g. Text, CheckBox, Select. Default is TEXT.
    readonly inputType?: HTMLInputTypeAttribute | undefined;    // The type to be used for the <input type='...' />. Only needed for TEXT controlType.
    readonly multiline?: boolean | undefined;                   // To allow line wrap to multiple lines. Only needed for TEXT controlType
}



/**
 * This is for input fields that 'value' prop is an Array of values. These are used for input fields which the user can select multiple values.
 * For these inputs, we can't define them like this
 *      interface MyComponent {
 *          fields: {
 *              myProp: BaseEntityField<string[]>  // This mean T will be string[]
 *              ...
 *          }
 *      }
 * And because T is a string[], 'options' props' type will also be a string[].
 *
 * So, for these input field, we need to use this interface instead e.g.
 *
 *      interface MyComponent {
 *          fields: {
 *              myProp: BaseEntityFieldArray<string>  // This mean T is a type string
 *              ...
 *          }
 *      }
 *
 * The `value` of this input field's type will be an array of T instead of just T
 */
export interface BaseEntityFieldArray<T> extends Omit<BaseEntityField<T>, 'value'> {
    readonly value?: readonly T[] | undefined;
    readonly multiple: true;
}



/**
 * The interface for collection of fields. Each entity has a collection of fields and the component must define the set of fields that
 * entity have. For example, the UserInfo component is used for displaying User entity and a User object has 'name', 'email', 'phone_number', etc...
 * therefore, these fields will be defined in the UserInfo component's 'fields' collection.
 * We don't know what fields a specific entity has so we won't define the specific fields here. The only thing we know is that
 * the collection must be an Object of fieldName => field type. The fieldType can be a type of 'BaseEntityField' or can be a nested collection
 * of fields. This will allow a component to have nested fields for the entity, not just a flat collection of fields.
 */
export interface EntityFieldsCollection {
    readonly [fieldName: string]: BaseEntityField<any>
    | EntityFieldsCollection
    | readonly BaseEntityField<any>[]
    | readonly EntityFieldsCollection[]
    | undefined;
}



export interface BaseInfoCompSaveAction<T> extends Omit<BaseCompAction, 'onClick'> {
    readonly onClick: (inputs: T)=> void;
}


/**
 * The interface for the most common set of actions that most info component need. If a component is editable, most of them will have an
 * 'edit' action that can trigger the component into edit mode. A 'cancel' action to cancel the edit mode. And a 'save' action to save the user
 * changes. This is NOT a FIXED set of actions all components must follow. Any specific component can extends this interface and add additional
 * actions that their UI need.
 */
export interface BaseInfoCompActionsSet {
    readonly startEdit?: BaseCompAction;                                        // The action to set the form to Edit mode
    readonly cancelEdit?: BaseCompAction;                                       // The action to stop the form from Edit mode
    readonly saveUpdate?: BaseInfoCompSaveAction<any>;                          // The action to save the form in Edit mode
    readonly removeObject?: BaseCompAction;                                     // The action to delete/remove the object this info comp is showing
}


/**
 * This is the base interface for all InfoComp's props. All info components will at least required to except a 'props' of this interface. Each
 * component can create its own props interface but that interface MUST extends this interface.
 */
export interface BaseInfoCompProps extends BaseCompProps {
    readonly isEditing?: boolean | undefined;

    readonly formProps?: {
        readonly className?: string | undefined;
    };

    // This is the set of fields a component has.
    readonly fields: EntityFieldsCollection;

    // This is the set of Actions that the component has. This is used for configuring the actions to show in the component UI.
    readonly actions?: BaseInfoCompActionsSet | undefined;

    // Event handler when the field is clicked. The container can do anything it needs to do such as change to Edit mode or take the user to some page
    readonly onFieldClicked?: (fieldName: string)=> void;

    // Event handler when ONE of the fields' value changed by user input
    readonly onFormInputChange?: (fieldName: string, value: any)=> void;    // Event handler when the field's value changed because of user input
}
