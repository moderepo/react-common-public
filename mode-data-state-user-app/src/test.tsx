/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import React, {
    useCallback, useContext,
} from 'react';
import {
    GenericGlobalDataStateProvider, ThunkAction,
} from '@moderepo/mode-data-state-base';
import {
    UserAppDataStateAction,
} from './actions';
import {
    initialUserAppDataState, userAppDataContext,
} from './context';
import {
    userAppDataStateReducer,
} from './reducer';
import {
    UserAppDataState,
} from './model';
import {
    logoutUser,
} from './authState';
import {
    setHomeDevices,
} from './homeDevicesState';


// Create a test function that return a normal thunk action
const createTestThunk = (): ThunkAction => {
    return async (): Promise<void> => {

    };
};



const TextComponent: React.FC = () => {
    const { dispatch } = useContext(userAppDataContext);

    // This will fail because action type is NOT one of the allowed types
    /*
    dispatch({
        type: "test",
    });
    */

    // This will fail because thunk action type is NOT one of the allowed thunk actions
    // dispatch(createTestThunk());

    // These should succeed because they are allowed actions
    dispatch(logoutUser());
    dispatch(setHomeDevices(1234, []));


    return (
        <div>test component</div>
    );
};

const TestDataStateProvider = ({ children }: React.PropsWithChildren<React.ReactNode>) => {

    const onLoading = useCallback(() => {
        // on load handler
    }, []);


    const onError = () => {
        // On error handler
    };


    return (
        <GenericGlobalDataStateProvider<UserAppDataState, UserAppDataStateAction>
            context={userAppDataContext}
            initialState={initialUserAppDataState}
            stateReducer={userAppDataStateReducer}
            onLoading={onLoading}
            onError={onError}
        >
            <TextComponent />
        </GenericGlobalDataStateProvider>
    );
};
