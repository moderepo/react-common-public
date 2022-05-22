import React, {
    useContext,
} from 'react';
import {
    modeUIContext, selectIsLoading,
} from '@moderepo/mode-ui-state';
import {
    LoadingScreen,
} from '../..';


/**
 * This is a component in charge of showing/hiding the loading comp based on the current state
 */
export const LoadingContainer: React.FC = () => {
    const { state } = useContext(modeUIContext);
    const isLoading = selectIsLoading(state);

    if (isLoading) {
        return (
            <LoadingScreen />
        );
    }
    return (
        <></>
    );
};
