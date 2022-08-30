import React, {
    useReducer, createContext, useMemo,
} from 'react';
import {
    ModeUIState,
} from './models';
import {
    UIAction, uiStateReducer,
} from './actionsAndReducers';
import {
    UsageMode,
} from '.';


/**
 * UI CONTEXT setup. The UI context will be used for storing UI states e.g. isLoading state, show/hide drawer menu state, etc...
 */


/**
 * The definition of the GlobalUI Context. A UI Context will have a state object and a dispatch function that can be use
 * to dispatch ui actions to update the state.
 */
export interface ModeUIContext {
    readonly state: ModeUIState;
    readonly dispatch: React.Dispatch<UIAction>;
}


// The initial state values for the global UI state
const initialModeUIState: ModeUIState = {
    isLoading        : false,
    drawerMenuOpened : false,
    currentLanguage  : 'en',
    isEditingForm    : false,
    usageMode        : UsageMode.MANAGE_DATA,
    controlPanelComps: [],
    cache            : {
    },
};



/**
 * An instance of the ModeUIContext. Any Component that are interested in the Mode UI context, can use React's useContext
 * to get a reference to this context like this
 *      const {state, dispatch} = React.useContext(modeUIContext);
 */
export const modeUIContext = createContext<ModeUIContext>({
    state   : initialModeUIState,
    dispatch: () => {
        return Promise.resolve();
    },
});



/**
 * Create a GENERIC Provider listen to the UI state's changes and update the children.
 */
export function ModeUIStateProvider ({ children }: React.PropsWithChildren<React.ReactNode>) {
    const [state, dispatch] = useReducer(uiStateReducer, initialModeUIState);

    const contextValue = useMemo(() => {
        return {
            state, dispatch,
        };
    }, [state]);

    return (
        <modeUIContext.Provider value={contextValue}>
            {children}
        </modeUIContext.Provider>
    );
}
