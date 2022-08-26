import produce, {
    Draft,
} from 'immer';
import React from 'react';
import {
    UsageMode,
} from '.';
import {
    ModeUIState, NotificationTypes, Notification, DialogOptions, SlideOutPanelOptions,
} from './models';

/**
 * Action types
 */
enum ActionType {
    SHOW_IS_LOADING = 'SHOW_IS_LOADING',
    OPEN_DRAWER_MENU = 'OPEN_DRAWER_MENU',
    CLOSE_DRAWER_MENU = 'CLOSE_DRAWER_MENU',
    SET_SELECTED_DRAWER_MENU_ITEM = 'SET_SELECTED_DRAWER_MENU_ITEM',
    SHOW_NOTIFICATION = 'SHOW_NOTIFICATION',
    HIDE_NOTIFICATION = 'HIDE_NOTIFICATION',
    SHOW_DIALOG = 'SHOW_DIALOG',
    HIDE_DIALOG = 'HIDE_DIALOG',
    SET_LANGUAGE = 'SET_LANGUAGE',
    SET_IS_EDITING_FORM = 'SET_IS_EDITING_FORM',
    SHOW_SLIDE_OUT_PANEL = 'SHOW_SLIDE_OUT_PANEL',
    HIDE_SLIDE_OUT_PANEL = 'HIDE_SLIDE_OUT_PANEL',
    ADD_CONTROL_PANEL_COMP = 'ADD_CONTROL_PANEL_COMP',
    REMOVE_CONTROL_PANEL_COMP = 'REMOVE_CONTROL_PANEL_COMP',
    SET_CACHE = 'SET_CACHE',
    DELETE_CACHE = 'DELETE_CACHE',
    SET_USAGE_MODE = 'SET_USAGE_MODE',
    BATCH_ACTIONS = 'BATCH_ACTIONS',
}



export enum ControlPanelCompPriority {
    HIGH = 1,
    MEDIUM = 2,
    LOW = 3,
}


/**
 * Action interfaces
 */
interface Action {
    readonly type: ActionType;
}


/**
 * An Action for setting isLoading props from appState
 * @param type - The action type
 * @param value - true/false for whether or not the app is loading
 */
interface ShowIsLoadingAction extends Action {
    readonly type: ActionType.SHOW_IS_LOADING;
    readonly value: boolean;
}


interface OpenDrawerMenuAction extends Action {
    readonly type: ActionType.OPEN_DRAWER_MENU;
}

interface CloseDrawerMenuAction extends Action {
    readonly type: ActionType.CLOSE_DRAWER_MENU;
}

interface SetSelectedDrawerMenuItemAction extends Action {
    readonly type: ActionType.SET_SELECTED_DRAWER_MENU_ITEM;

    // The item can be anything the user want to use, a string, an object, etc...
    readonly menuItem: unknown | undefined;
}

/**
 * An Action for setting a notification to the appState
 * @param type - The action type
 * @param notification - The notification to set to the appState. Leave empty to unset/remove the notification.
 */
interface ShowNotificationAction extends Action {
    readonly type: ActionType.SHOW_NOTIFICATION;
    readonly notification?: Notification;
}


/**
 * An Action for removing the current notification from the appState
 */
interface HideNotificationAction extends Action {
    readonly type: ActionType.HIDE_NOTIFICATION;
}

/**
 * An action to show a dialog
 * @param type - The action type
 * @param dialogOptions - The options to customize the dialog e.g. title, message, icon, etc...
 */
interface ShowDialogAction extends Action {
    readonly type: ActionType.SHOW_DIALOG,
    readonly dialogOptions: DialogOptions
}

/**
 * An action to hide the current dialog
 */
interface HideDialogAction extends Action {
    readonly type: ActionType.HIDE_DIALOG,
}

/**
 * An action to change the current language
 */
interface SetLanguageAction extends Action {
    readonly type: ActionType.SET_LANGUAGE;
    readonly language: string;
}


interface SetIsEditingFormAction extends Action {
    readonly type: ActionType.SET_IS_EDITING_FORM;
    readonly value: boolean;
}


interface ShowSlideOutPanelAction extends Action {
    readonly type: ActionType.SHOW_SLIDE_OUT_PANEL,
    readonly options: SlideOutPanelOptions;
}

interface HideSlideOutPanelAction extends Action {
    readonly type: ActionType.HIDE_SLIDE_OUT_PANEL,
}

interface AddControlPanelCompPanelAction extends Action {
    readonly type: ActionType.ADD_CONTROL_PANEL_COMP,
    readonly name: string;
    readonly component: React.ReactNode;
    readonly priority?: ControlPanelCompPriority | undefined;
}

interface RemoveControlPanelCompPanelAction extends Action {
    readonly type: ActionType.REMOVE_CONTROL_PANEL_COMP,
    readonly name: string;
}

interface SetCacheAction extends Action {
    readonly type: ActionType.SET_CACHE,
    readonly key: string;
    readonly value: any;
}

interface DeleteCacheAction extends Action {
    readonly type: ActionType.DELETE_CACHE,
    readonly key: string;
}

interface SetUsageModeAction extends Action {
    readonly type: ActionType.SET_USAGE_MODE,
    readonly value: UsageMode;
}

interface BatchActionsAction extends Action {
    readonly type: ActionType.BATCH_ACTIONS;
    readonly actions: readonly Action[]
}


// Union of all the action types
export type UIAction =
    ShowIsLoadingAction |
    OpenDrawerMenuAction |
    CloseDrawerMenuAction |
    SetSelectedDrawerMenuItemAction |
    ShowDialogAction |
    HideDialogAction |
    ShowNotificationAction |
    HideNotificationAction |
    SetLanguageAction |
    SetIsEditingFormAction |
    ShowSlideOutPanelAction |
    HideSlideOutPanelAction |
    AddControlPanelCompPanelAction |
    RemoveControlPanelCompPanelAction |
    SetCacheAction |
    DeleteCacheAction |
    SetUsageModeAction |
    BatchActionsAction;



/** *********  Action creators  ************** */


/**
 * Create an Action to set isLoading to true/false to the appState. This is used for when the app is busy and we
 * want to show some indicator that the app is busy.
 * @param value - Whether or not the app is loading.
 */
export const setIsLoading = (value: boolean = false): ShowIsLoadingAction => {
    return {
        type: ActionType.SHOW_IS_LOADING,
        value,
    };
};


/**
 * Create an Action to open the drawer menu
 */
export const openDrawerMenu = (): OpenDrawerMenuAction => {
    return {
        type: ActionType.OPEN_DRAWER_MENU,
    };
};


/**
 * Create an action to close the drawer menu
 */
export const closeDrawerMenu = (): CloseDrawerMenuAction => {
    return {
        type: ActionType.CLOSE_DRAWER_MENU,
    };
};


/**
 * Create an action to set the selected drawer menu item
 */
export const setSelectedDrawerMenuItem = (menuItem: unknown | undefined): SetSelectedDrawerMenuItemAction => {
    return {
        type: ActionType.SET_SELECTED_DRAWER_MENU_ITEM,
        menuItem,
    };
};



/**
 * Helper functions to create notification action. This function will be private and used by one of the
 * functions below
 * @param message
 * @param notifType
 */
const showNotification = (
    message: string, notifType: NotificationTypes, messageData?: any, duration?: number,
): ShowNotificationAction => {
    return {
        type        : ActionType.SHOW_NOTIFICATION,
        notification: {
            type: notifType,
            message,
            messageData,
            duration,
        },
    };
};


/**
 * Create an Action to set an INFO type of alert message
 * @param message - The message to show.
 * @param messageData - OPTIONAL - The data to be used for translating the message if message contains variables.
 * @param duration - How long to show the message. If not provided, the default value will be used.
 */
export const showInfoNotification = (
    message: string, messageData?: any, duration?: number,
): ShowNotificationAction => {
    return showNotification(message, NotificationTypes.INFO, messageData, duration);
};


/**
 * Create an Action to set an SUCCESS type of alert message
 * @param message - The message to show.
 * @param messageData - OPTIONAL - The data to be used for translating the message if message contains variables.
 * @param duration - How long to show the message. If not provided, the default value will be used.
 */
export const showSuccessNotification = (
    message: string, messageData?: any, duration?: number,
): ShowNotificationAction => {
    return showNotification(
        message, NotificationTypes.SUCCESS, messageData, duration,
    );
};


/**
 * Create an Action to set an WARNING type of alert message
 * @param message - The message to show.
 * @param messageData - OPTIONAL - The data to be used for translating the message if message contains variables.
 * @param duration - How long to show the message. If not provided, the default value will be used.
 */
export const showWarningNotification = (
    message: string, messageData?: any, duration?: number,
): ShowNotificationAction => {
    return showNotification(
        message, NotificationTypes.WARNING, messageData, duration,
    );
};


/**
 * Create an Action to set an ERROR type of alert message
 * @param message - The message to show.
 * @param messageData - OPTIONAL - The data to be used for translating the message if message contains variables.
 * @param duration - How long to show the message. If not provided, the default value will be used.
 */
export const showErrorNotification = (
    message: string, messageData?: any, duration?: number,
): ShowNotificationAction => {
    return showNotification(
        message, NotificationTypes.ERROR, messageData, duration,
    );
};


/**
 * Create an action to remove the current notification
 */
export const hideNotification = (): HideNotificationAction => {
    return {
        type: ActionType.HIDE_NOTIFICATION,
    };
};


/**
 * Create an action to show a dialog.
 * @param dialogOptions - The options to customize the dialog e.g. title, message, button label, etc...
 */
export const showDialog = (dialogOptions: DialogOptions): ShowDialogAction => {
    return {
        type: ActionType.SHOW_DIALOG,
        dialogOptions,
    };
};


/**
 * Create an action to hide the current dialog
 */
export const hideDialog = (): HideDialogAction => {
    return {
        type: ActionType.HIDE_DIALOG,
    };
};


/**
 * Create an action to change the current language
 */
export const setLanguage = (language: string): SetLanguageAction => {
    return {
        type: ActionType.SET_LANGUAGE,
        language,
    };
};


/**
 * Create an action to change the current isEditingForm flag
 */
export const setIsEditingForm = (value: boolean): SetIsEditingFormAction => {
    return {
        type: ActionType.SET_IS_EDITING_FORM,
        value,
    };
};


/**
 * Create an action to show the slide out panel.
 */
export const showSlideOutPanel = (options: SlideOutPanelOptions): ShowSlideOutPanelAction => {
    return {
        type: ActionType.SHOW_SLIDE_OUT_PANEL,
        options,
    };
};


/**
 * Create an action to hide the current slide out panel
 */
export const hideSlideOutPanel = (): HideSlideOutPanelAction => {
    return {
        type: ActionType.HIDE_SLIDE_OUT_PANEL,
    };
};


/**
 * Create an action to add a component to the control panel.
 * @param priority - If not specified, the default is LOW and the component will be placed at the bottom of the container
 */
export const addControlPanelComp = (
    name: string, component: React.ReactNode, priority?: ControlPanelCompPriority,
): AddControlPanelCompPanelAction => {
    return {
        type: ActionType.ADD_CONTROL_PANEL_COMP,
        name,
        component,
        priority,
    };
};


/**
 * Create an action to hide the current slide out panel
 */
export const removeControlPanelComp = (name: string): RemoveControlPanelCompPanelAction => {
    return {
        type: ActionType.REMOVE_CONTROL_PANEL_COMP,
        name,
    };
};

/**
 * Create an action to set a cache key/value
 */
export const setCache = (key: string, value: any): SetCacheAction => {
    return {
        type: ActionType.SET_CACHE,
        key,
        value,
    };
};


/**
 * Create an action to delete a cache for a given key
 */
export const deleteCache = (key: string): DeleteCacheAction => {
    return {
        type: ActionType.DELETE_CACHE,
        key,
    };
};


/**
 * Create an action to change the usage mode
 */
export const setUsageMode = (value: UsageMode): SetUsageModeAction => {
    return {
        type: ActionType.SET_USAGE_MODE,
        value,
    };
};


/**
 * Create an action to batch multiple data actions in 1 dispatch
 * @param actions
 */
export const batchActions = (actions: Action[]): BatchActionsAction => {
    return {
        type: ActionType.BATCH_ACTIONS,
        actions,
    };
};



export const uiStateReducer = (currentState: ModeUIState, action: Action): ModeUIState => {
    const { type } = action;

    switch (type) {

        case ActionType.SHOW_IS_LOADING:
            return produce(currentState, (draft: Draft<ModeUIState>) => {
                const actualAction = action as ShowIsLoadingAction;
                draft.isLoading = actualAction.value;
            });

        case ActionType.OPEN_DRAWER_MENU:
            return produce(currentState, (draft: Draft<ModeUIState>) => {
                draft.drawerMenuOpened = true;
            });

        case ActionType.CLOSE_DRAWER_MENU:
            return produce(currentState, (draft: Draft<ModeUIState>) => {
                draft.drawerMenuOpened = false;
            });

        case ActionType.SET_SELECTED_DRAWER_MENU_ITEM:
            return produce(currentState, (draft: Draft<ModeUIState>) => {
                draft.selectedDrawerMenuItem = (action as SetSelectedDrawerMenuItemAction).menuItem;
            });

        case ActionType.SHOW_NOTIFICATION:
            return produce(currentState, (draft: Draft<ModeUIState>) => {
                const actualAction = action as ShowNotificationAction;
                draft.notification = actualAction.notification;
            });

        case ActionType.HIDE_NOTIFICATION:
            return produce(currentState, (draft: Draft<ModeUIState>) => {
                delete draft.notification;
            });

        case ActionType.SHOW_DIALOG:
            return produce(currentState, (draft: Draft<ModeUIState>) => {
                const actualAction = action as ShowDialogAction;
                draft.dialogOptions = actualAction.dialogOptions;
            });

        case ActionType.HIDE_DIALOG:
            return produce(currentState, (draft: Draft<ModeUIState>) => {
                delete draft.dialogOptions;
            });

        case ActionType.SET_LANGUAGE:
            return produce(currentState, (draft: Draft<ModeUIState>) => {
                const actualAction = action as SetLanguageAction;
                draft.currentLanguage = actualAction.language;
            });

        case ActionType.SET_IS_EDITING_FORM:
            return produce(currentState, (draft: Draft<ModeUIState>) => {
                const actualAction = action as SetIsEditingFormAction;
                draft.isEditingForm = actualAction.value;
            });

        case ActionType.SHOW_SLIDE_OUT_PANEL:
            return produce(currentState, (draft: Draft<ModeUIState>) => {
                const actualAction = action as ShowSlideOutPanelAction;
                draft.slideOutPanelOptions = actualAction.options;
            });
    
        case ActionType.HIDE_SLIDE_OUT_PANEL:
            return produce(currentState, (draft: Draft<ModeUIState>) => {
                delete draft.slideOutPanelOptions;
            });

        case ActionType.ADD_CONTROL_PANEL_COMP:
            return produce(currentState, (draft: Draft<ModeUIState>) => {
                const actualAction = action as AddControlPanelCompPanelAction;

                // Only add the component info the the "controlPanelComps" if there isn't a compInfo with the same name
                if (
                    draft.controlPanelComps.find((compInfo) => {
                        return compInfo.name === actualAction.name;
                    }) === undefined
                ) {
                    draft.controlPanelComps.push({
                        name    : actualAction.name,
                        comp    : actualAction.component,
                        priority: actualAction.priority,
                    });
                }
            });
        
        case ActionType.REMOVE_CONTROL_PANEL_COMP:
            return produce(currentState, (draft: Draft<ModeUIState>) => {
                const actualAction = action as AddControlPanelCompPanelAction;
                const index = draft.controlPanelComps.findIndex((compInfo) => {
                    return compInfo.name === actualAction.name;
                });
                if (index >= 0) {
                    draft.controlPanelComps.splice(index, 1);
                }
            });

        case ActionType.SET_CACHE:
            return produce(currentState, (draft: Draft<ModeUIState>) => {
                const actualAction = action as SetCacheAction;
                draft.cache[actualAction.key] = actualAction.value;
            });

        case ActionType.DELETE_CACHE:
            return produce(currentState, (draft: Draft<ModeUIState>) => {
                const actualAction = action as DeleteCacheAction;
                delete draft.cache[actualAction.key];
            });
    
        case ActionType.SET_USAGE_MODE:
            return produce(currentState, (draft: Draft<ModeUIState>) => {
                const actualAction = action as SetCacheAction;
                draft.usageMode = actualAction.value;
            });

        case ActionType.BATCH_ACTIONS:
            return produce(currentState, () => {
                const actualAction = action as BatchActionsAction;
                return actualAction.actions.reduce((state: any, a: Action): any => {
                    return uiStateReducer(state, a);
                }, currentState);
            });

        default:
            return currentState;
    }
};
