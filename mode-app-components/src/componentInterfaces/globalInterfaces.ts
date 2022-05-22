import {
    PropTypes,
} from '@material-ui/core';
import {
    CSSProperties,
} from 'react';

/**
 * A map of placeholder name => value. The translation function will use this map to replace placeholders inside the translation with these values.
 */
interface InterpolationMap {
    readonly [placeholder: string]: any
}

/**
 * The translation function. We want to keep Mode app flexible so we can't force the user to use a specific translation library. However, we need
 * to know something about the translation library in order to use it therefore we create this interface for the translation function to
 * implement. The user can pass in any translation function as long as it has this interface.
 *
 *      - The first argument MUST be a string which will be used as the translation key
 *      - The second argument is OPTIONAL and can be a
 *          - String which will be used as default value if the translation key is not found
 *          - A map of {key:value} pairs which will be used for Interpolation, replacing placeholders in the translation with actual values
 *      - The third argument is OPTIONAL and can be a map of {key:value} pairs which will be used for Interpolation, replacing placeholders in the
 *        translation with actual values
 *      - The function must return a String of the translated value based on the arguments
 */
export type TranslateF = (
    key: string,
    defaultValue?: string | InterpolationMap,
    interpolationMap?: InterpolationMap
)=> string;


/**
 * Interface for an action. Each action will need a 'label' and an 'icon'. Any specific component can extends this interface if they
 * need to add addition props for their UI.
 */
export interface BaseCompAction {
    readonly className?: string | undefined;
    readonly style?: CSSProperties | undefined;
    readonly label?: string;
    readonly icon?: string;
    readonly variant?: 'text' | 'outlined' | 'contained' | undefined;
    readonly type?: 'success' | 'warning' | 'error' | 'info' | undefined;
    readonly color?: PropTypes.Color | undefined;
    readonly disabled?: boolean;
    readonly onClick: ()=> void;
}

export interface BaseCompSubAction {
    readonly className?: string | undefined;
    readonly style?: CSSProperties | undefined;
    readonly label?: string;
    readonly icon?: string;
    readonly type?: 'success' | 'warning' | 'error' | 'info' | undefined;
    readonly disabled?: boolean;
    readonly actions: readonly BaseCompAction[];
}


/**
 * type guard function to check if an Action is a BaseCompAction
 * @param action
 * @returns
 */
export const isBaseCompAction = (action: unknown): action is BaseCompAction => {
    return (action as BaseCompAction).onClick !== undefined;
};


/**
 * type guard function to check if an Action is a BaseCompSubAction
 * @param action
 * @returns
 */
export const isBaseCompSubAction = (action: unknown): action is BaseCompSubAction => {
    return (action as BaseCompSubAction).actions instanceof Array;
};
