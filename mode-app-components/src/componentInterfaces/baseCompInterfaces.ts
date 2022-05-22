import {
    CSSProperties,
} from 'react';
import {
    BaseCompAction, BaseCompSubAction,
} from './globalInterfaces';



/**
 * This is the base interface for all generic Component's props. All generic components will at least required to except a 'props' of this
 * interface. Each component can create its own props interface but that interface MUST extends this interface.
 */
export interface BaseCompProps {
    readonly className?: string | undefined;
    readonly style?: CSSProperties | undefined;
    readonly title?: string | undefined;
    readonly subtitle?: string | undefined;
    readonly icon?: string | undefined;

    // To hide the header e.g. the title bar
    readonly headerless?: boolean | undefined;

    // To hide the header bottom border
    readonly borderlessHeader?: boolean | undefined;

    readonly onTitleClick?: (()=> void) | undefined;
    readonly onIconClick?: (()=> void) | undefined;

    // This is the set of PRIMARY Actions that the component has. This is used for configuring the actions to show in the component UI.
    // These actions will be disabled as individual buttons in the header bar on the left. Since these are actual buttons, there shouldn't
    // be more than 2 buttons
    readonly customPrimaryActions?: readonly BaseCompAction[] | undefined;

    // This is the set of Actions that the component has. This is used for configuring the actions to show in the component UI.
    readonly customSecondaryActions?: readonly (BaseCompAction | BaseCompSubAction)[] | undefined;

    // When to show the ... custom actions. Default is always show.
    readonly showCustomActionOnHover?: boolean | undefined;
}
