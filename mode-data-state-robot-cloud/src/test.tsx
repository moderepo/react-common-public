/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import React, {
    useContext,
} from 'react';
import {
    GenericGlobalDataStateProvider, ThunkAction,
} from '@moderepo/mode-data-state-base';
import {
    initialRCDataState, rcDataContext,
} from './context';
import {
    RCDataState,
} from './model';
import {
    RCDataStateAction,
} from './actions';
import {
    rcDataStateReducer,
} from './reducer';
import {
    fetchRobotStatus, setRobotCatalog,
} from './robotCloudState';


// Create a test function that return a normal thunk action
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createTestThunk = (): ThunkAction => {
    return async (): Promise<void> => {

    };
};


const TextComponent: React.FC = () => {
    const { dispatch } = useContext(rcDataContext);

    // This will fail because action type is NOT one of the allowed types
    /*
    dispatch({
        type: "my action type",
    });
    */

    // This will fail because thunk action type is NOT one of the allowed thunk actions
    // dispatch(createTestThunk());

    // These should succeed because they are allowed actions
    dispatch(fetchRobotStatus(1234, 'myRobotId'));
    dispatch(setRobotCatalog(1234, []));


    return (
        <div>test component</div>
    );
};

const TestDataStateProvider = ({ children }: React.PropsWithChildren<React.ReactNode>) => {

    const onLoading = () => {
        // on load handler
    };


    const onError = () => {
        // On error handler
    };


    return (
        <GenericGlobalDataStateProvider<RCDataState, RCDataStateAction>
            context={rcDataContext}
            initialState={initialRCDataState}
            stateReducer={rcDataStateReducer}
            onLoading={onLoading}
            onError={onError}
        >
            <TextComponent />
        </GenericGlobalDataStateProvider>
    );
};
