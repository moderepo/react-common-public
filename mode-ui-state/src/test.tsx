/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import React, {
    useContext,
} from 'react';
import {
    showErrorNotification,
} from './actionsAndReducers';
import {
    ModeUIStateProvider, modeUIContext,
} from './context';



const TextComponent: React.FC = () => {
    const { dispatch } = useContext(modeUIContext);

    // This will fail because action type is NOT one of the allowed types
    /*
    dispatch({
        type: 'my action type',
    });
    */


    // These should succeed because they are allowed actions
    dispatch(showErrorNotification('test message'));


    return (
        <div>test component</div>
    );
};

const TestDataStateProvider = ({ children }: React.PropsWithChildren<React.ReactNode>) => {

    return (
        <ModeUIStateProvider>
            <TextComponent />
        </ModeUIStateProvider>
    );
};
