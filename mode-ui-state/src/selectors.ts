import React from 'react';
import {
    ControlPanelCompPriority,
    UsageMode,
} from '.';
import {
    ModeUIState, Notification, DialogOptions, SlideOutPanelOptions,
} from './models';


/**
 * This is where we define all the functions for getting data from UI state. Instead of having components accessing
 * the state directly, the components should call these functions to get data. This is to encapsulate the AppState's data
 * structure from the components. The components shouldn't know anything about the structure of the AppState. This way
 * it would be easier to change the AppState's structure without having to go through all the components and fix them.
 */

export const selectIsLoading = (state: ModeUIState): boolean => {
    return state.isLoading;
};


export const selectDrawerMenuOpened = (state: ModeUIState): boolean => {
    return state.drawerMenuOpened;
};

export const selectSelectedDrawerMenuItem = (state: ModeUIState): unknown | undefined => {
    return state.selectedDrawerMenuItem;
};

export const selectNotification = (state: ModeUIState): Notification | undefined => {
    return state.notification;
};


export const selectDialogOptions = (state: ModeUIState): DialogOptions | undefined => {
    return state.dialogOptions;
};


export const selectLanguage = (state: ModeUIState): string => {
    return state.currentLanguage;
};

export const selectIsEditingForm = (state: ModeUIState): boolean => {
    return state.isEditingForm;
};


export const selectSlideOutPanelOptions = (state: ModeUIState): SlideOutPanelOptions | undefined => {
    return state.slideOutPanelOptions;
};

export const selectControlPanelComponents = (state: ModeUIState): readonly React.ReactNode[] | undefined => {
    return [...state.controlPanelComps].sort((compInfo1, compInfo2) => {
        if (compInfo1 && compInfo2) {
            return (compInfo1.priority ?? ControlPanelCompPriority.LOW) - (compInfo2.priority ?? ControlPanelCompPriority.LOW);
        }
        if (compInfo1) {
            return 1;
        }
        if (compInfo2) {
            return -1;
        }
        return 0;
    }).map((compInfo): React.ReactNode => {
        return compInfo?.comp;
    });
};

export const selectCache = (state: ModeUIState, key: string): any => {
    return state.cache[key];
};

export const selectCurrentUsageMode = (state: ModeUIState): UsageMode => {
    return state.usageMode;
};
