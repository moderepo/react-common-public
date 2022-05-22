/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import produce, {
    Draft,
} from 'immer';
import React, {
    createContext, useContext,
} from 'react';
import {
    BaseAction, BaseActionType, BatchActionsAction, ThunkAction, batchActions,
} from './actions';
import {
    GenericGlobalDataStateProvider,
} from './context';

type TestGlobalStateAction = BatchActionsAction | ThunkAction;


/**
 * Define a state object for your app
 */
interface TestGlobalDataState {
    readonly prop1: string;
    readonly prop2: number;
}

/**
 * Create an instance of state object and initialize it with some value.
 */
const initialTestGlobalDataState: TestGlobalDataState = {
    prop1: 'abc',
    prop2: 123,
};



/**
 * An instance of the GlobalDataContext. Any Component that are interested in the global data context, can use React's useContext
 * to get a reference to this context like this
 *      const {state, dispatch} = React.useContext<GlobalDataContext<GlobalDataState>>(globalDataContext);
 *
 * NOTE: This is just an example for other Data State to follow but not meant to be used since GlobalDataState doesn't have any
 * state so it is useless.
 */
const testGlobalDataContext = createContext({
    state   : initialTestGlobalDataState,
    dispatch: (action: TestGlobalStateAction | ThunkAction): Promise<any> => {
        return Promise.resolve();
    },
});


/**
 * This is the root reducer for the data state. It will be the starting point for data state reducer. It actually doesn't
 * handle any action other than the BatchAction. It will escalate all the tasks to each individual sub state.
 * Each data state will need to implement the reducer like this
 *
 * @param currentState
 * @param action
 */
const testGlobalDataStateReducer = (currentState: TestGlobalDataState, action: BaseAction): TestGlobalDataState => {
    const { type } = action;

    switch (type) {
        case BaseActionType.BATCH_ACTIONS:
            return produce(currentState, () => {
                const actualAction = action as BatchActionsAction;
                return actualAction.actions.reduce((state: any, a: BaseAction): any => {
                    return testGlobalDataStateReducer(state, a);
                }, currentState);
            });

        default:
            // Apply reducer for each individual sub state
            return produce(currentState, (draft: Draft<TestGlobalDataState>) => {
            });
    }
};


const TextComponent: React.FC = () => {
    const { dispatch } = useContext(testGlobalDataContext);

    // This will fail because action type is not one of the allowed types
    /*
    dispatch({
        type   : "test",
        actions: [],
    });
    */

    // This should work
    dispatch(batchActions([]));


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
        <GenericGlobalDataStateProvider<TestGlobalDataState, TestGlobalStateAction>
            context={testGlobalDataContext}
            initialState={initialTestGlobalDataState}
            stateReducer={testGlobalDataStateReducer}
            onLoading={onLoading}
            onError={onError}
        >
            <TextComponent />
        </GenericGlobalDataStateProvider>
    );
};
