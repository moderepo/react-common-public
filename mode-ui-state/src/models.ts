import {
    CSSProperties,
} from 'react';

/**
 * The types of notification we can show
 */
export enum NotificationTypes {
    INFO = 'info',          // Use for showing informational message to the agent
    SUCCESS = 'success',    // Use for showing success messages
    WARNING = 'warning',    // Use for showing warnings
    ERROR = 'error',        // Use for showing errors
}


/**
 * Data structure for a notification
 */
export interface Notification {
    readonly type: NotificationTypes;    // The type of message to show
    readonly message: string;            // The message string
    readonly messageData?: any;          // The data to be passed to the translation system when translating message if message contains variables
    readonly duration?: number;          // How long to keep the message visible. Default value will be used if not specified.
}


export enum DialogResponseCode {
    NEGATIVE = 0,
    POSITIVE = 1,
}

export interface DialogResponse {
    code: DialogResponseCode;
    input?: string;
}

export enum DialogType {
    INFO = 'info',
    SUCCESS = 'success',
    WARNING = 'warning',
    ERROR = 'error',
    CONFIRM = 'confirm',
    INPUT = 'input',
}

/**
 * type: DialogType - OPTIONAL. The type of dialog to show. This will be used for adding an icon in the dialog.
 * title: string - OPTIONAL. The dialog title
 * titleData: any - OPTIONAL. The interpolation data to be passed to the translation system to translate the title if the title contains variables
 * message: string - OPTIONAL. The center message
 * messageData: any - OPTIONAL. The data for the message if message contains variables
 * positiveButton: string - OPTIONAL. The label to be used for the positive button e.g. 'Yes', 'Ok', 'Sure', 'Delete', etc...
 * positiveButtonData: any - OPTIONAL. The positive button data if the label contains variables
 * negativeButton: string - OPTIONAL. The label to be used for the negative button e.g. 'No', 'Cancel', etc...
 * negativeButtonData: any - OPTIONAL. The negative button data if the label contains variables
 * disableBackdropClick: boolean - OPTIONAL. Disable dialog from closing when user click the backdrop. Default is TRUE unless explicitly set to false
 * disableEscapeKeyDown: boolean - OPTIONAL. Disable dialog from closing when user hit ESC key. Default is FALSE unless explicitly set to true.
 */
export interface DialogOptions {
    readonly className?: string | undefined;
    readonly style?: CSSProperties | undefined;
    readonly type?: DialogType,
    readonly title?: string;
    readonly titleData?: any;
    readonly message?: string;
    readonly messageData?: any;
    readonly input?: {
        readonly type: string;               // Input type 'text', 'password', 'email', 'phone', etc...
        readonly name: string;
        readonly required?: boolean;         // Default is true unless explicitly set to false
        readonly error?: string;
        readonly placeholder?: string;
        readonly translationData?: any;
        readonly defaultValue?: string;
    },
    readonly positiveButton?: string;
    readonly positiveButtonData?: any;
    readonly negativeButton?: string;
    readonly negativeButtonData?: any;
    readonly onClose?: (response?: DialogResponse)=> void;
    readonly disableBackdropClick?: boolean;
    readonly disableEscapeKeyDown?: boolean;
}



export interface ModeUIState {
    readonly isLoading: boolean;
    readonly drawerMenuOpened: boolean;
    readonly selectedDrawerMenuItem?: unknown | undefined;
    readonly notification?: Notification | undefined;
    readonly dialogOptions?: DialogOptions;
    readonly currentLanguage: string;
    readonly isEditingForm: boolean;
    readonly slideOutPanelOptions?: SlideOutPanelOptions | undefined;
    readonly controlPanelComp?: React.ReactNode | undefined;
    readonly cache: object;
}


/**
 * The location where the slide out panel should be slide out from. This location can be different each time we show the
 * slide out panel, it doesn't have to be the same location every time.
 */
export enum SlideOutPanelLocation {
    LEFT = 'left',
    RIGHT = 'right',
    TOP = 'top',
    BOTTOM = 'bottom',
}


/**
 * The options to specify how the slide out panel should be displayed e.g. the location to slide out from, what type of component
 * to display and the props to pass to the component.
 */
export interface SlideOutPanelOptions {
    // the location where the panel will slide out from. The default is RIGHT side.
    readonly location?: SlideOutPanelLocation | undefined;

    // The type of the component that the panel need to display. When we show a Slide Out panel, we usually want to show some content in the
    // panel. This is how we tell the handler which content to add to the panel. This is just a string, it is up to the handler to decide
    // what to name the component types and what component to create based on the type
    readonly compType: string;

    // The data to be passed to the content component. Most component will need some props so that it can create the UI for the component.
    // The type is 'unknown' because we don't know what props the component needs. It is up to the component to define the props structure
    // and the handler should know what props the component needs when it show or create the component.
    readonly compProps: unknown;
}
