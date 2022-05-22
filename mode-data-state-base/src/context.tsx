import React, {
    useReducer, useCallback, useMemo,
} from 'react';
import {
    ApiError,
} from '@moderepo/mode-apis-base';
import {
    BaseAction, ThunkAction,
} from './actions';



/**
 * Extends React dispatch function which can handle regular Action AND also ThunkAction. React's
 * dispatch function CAN NOT handle thunk actions so we need to define this dispatcher.
 */
export type ExtDispatch<ActionType extends BaseAction | ThunkAction> = (
    action: ActionType, showLoading?: boolean, suppressErrors?: boolean
)=> Promise<void>;



/**
 * Because the GlobalDataStateProvider is generic, the container that uses this GlobalDataStateProvider must provide the context,
 * initialState data, the state reducer, and the errorMessages map of errorCode => errorMessage.
 */
interface GenericGlobalDataStateProviderProps<StateType extends Object, ActionType extends BaseAction | ThunkAction> {
    readonly context: React.Context<{
        readonly state: StateType;
        readonly dispatch: ExtDispatch<ActionType>;
    }>;
    readonly initialState: StateType;
    readonly stateReducer: (currentState: StateType, action: BaseAction)=> StateType;
    readonly onLoading: (value: boolean)=> void;
    readonly onError: (error: ApiError)=> void;
}



/**
 * Create a Provider listen to the data state data changes and update the children. This provider is generic and can be used
 * for any type of global data state.
 */
export const GenericGlobalDataStateProvider = <StateType extends Object, ActionType extends BaseAction | ThunkAction>(
    {
        context,
        stateReducer,
        initialState,
        onLoading,
        onError,
        children,
    }: GenericGlobalDataStateProviderProps<StateType, ActionType> & React.PropsWithChildren<React.ReactNode>,
) => {

    const [state, dispatch] = useReducer<(state: StateType, action: BaseAction)=> StateType>(stateReducer, initialState);


    /**
     * Implement the ExtDispatch function. ExtDispatch will take an action and check if it is a function.
     * If action is a function, it will assume the function is a ThunkAction and will call the function
     * and return the result from the function. If the action IS NOT a function, we will assume the action
     * is a normal Action and will use React's dispatch to dispatch it which will be handled by the
     * reducer.
     */
    // eslint-disable-next-line no-redeclare
    const dispatchInterceptor = useCallback(async (
        action: BaseAction | ThunkAction, showLoading?: boolean, suppressError?: boolean,
    ): Promise<void> => {
        if (action instanceof Function) {
            // action is a ThunkAction. Call the function and return the result.

            try {
                // Pre API call setup
                // By default, we will show the loading overlay to block user interactions. To force this action NOT to block the
                // screen, pass 'false' for 'showLoading' param.
                if (showLoading !== false) {
                    onLoading(true);
                }
                const thunkAction = action as ThunkAction;
                return await thunkAction(dispatchInterceptor);
            } catch (error) {
                // Post API call error handler
                // By default we WILL show errors. But sometime we don't want to show because we expected errors to occur so if this is the case,
                // pass 'true' for suppressError param to suppress errors for this action.
                if (suppressError !== true) {
                    onError(error as ApiError);
                }
                // eslint-disable-next-line no-console
                console.error(error);
                throw error;
            } finally {
                // Post API call handler
                if (showLoading !== false) {
                    onLoading(false);
                }
            }
        }

        // action is a normal Action, use React.dispatch to dispatch it.
        return dispatch(action as BaseAction);
    }, [onError, onLoading]);


    const contextValue = useMemo(() => {
        return {
            state,
            dispatch: dispatchInterceptor,
        };
    }, [state, dispatchInterceptor]);


    // Instead of using the 'dispatch' from the context, we will use dispatchInterceptor to intercept the dispatch call and handle the call.
    // This is how we can support Thunk actions.
    return (
        <context.Provider value={contextValue}>
            {children}
        </context.Provider>
    );
};
