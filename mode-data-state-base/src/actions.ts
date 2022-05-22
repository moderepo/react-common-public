import {
    ExtDispatch,
} from './context';


/**
 * Convert a search params object to string. This will be used as a key for storing search results for some of the data state that has
 * search, pagination, and filtering,
 * @param params
 */
export const searchParamsToString = (params?: any | undefined | null): string => {

    if (params !== null && params !== undefined) {
        // We can't use JSON.stringify to convert the params to string because it doesn't return the same string given 2 different objects
        // with the same keys/values. e.g.
        //      {a:1, b:2} => '{"a":1,"b":2}'
        //      {b:2, a:1} => '{"b":2,"a":1}'
        // If 2 objects have the same fields and values for those fields, we want to output the same string, the order of the fields does not matter.

        // To guarantee we return the same string given similar objects, we need to sort the keys first
        const sortedKeys = Object.keys(params).sort();

        // now go through the keys and build an Array of key:value separated by commas and convert that array to string.
        return sortedKeys.filter((key: string) => {
            // filter out null and undefined values
            return params[key] !== undefined && params[key] !== null;
        }).map((key: string): string => {
            return `${key}:${params[key]}`;
        }).join(',') || '_';
    }

    return '_';
};



/**
 * Below are the list of action types that can be dispatched from components. Components don't
 * really need to know about these actions or use them directly. Components should be using the
 * action creators. This will only contain the list of action type that the root reducer can handle.
 * Each sub state will define its own set of action types.
 */
export enum BaseActionType {
    BATCH_ACTIONS = 'batch actions'
}



/**
 * This is the base interface for all action interfaces. All action will at least have a 'type' so the base interface
 * will define the 'type' and the sub action interfaces can define additional props as needed.
 */
export interface BaseAction {
    readonly type: string;
}



/**
 * The action interface for dispatching multiple actions in 1 dispatch. This action can be used when we need to update multiple
 * parts of the state. Instead of dispatching each individual action to update 1 part of state, we can use the to do them all
 * in 1 batch. This is the preferred method for dispatching multiple actions at the same time for performance optimization. Each
 * dispatch will trigger component re-render so if you have multiple actions to dispatch, use this to batch them.
 */
export interface BatchActionsAction extends BaseAction {
    readonly type: BaseActionType.BATCH_ACTIONS;
    readonly actions: readonly BaseAction[]
}



/**
 * Create an action to batch multiple data actions in 1 dispatch
 * @param actions
 */
export const batchActions = (actions: BaseAction[]): BatchActionsAction => {
    return {
        type: BaseActionType.BATCH_ACTIONS,
        actions,
    };
};


export type BaseDataStateAction = BatchActionsAction;


/**
 * Definition of a ThunkAction. A ThunkAction is an ASYNC function which takes a dispatch function and then execute some async code
 * (e.g. making api call) and then dispatch another action to update the state.
 */
export type ThunkAction = (dispatch: ExtDispatch<BaseAction | ThunkAction>)=> Promise<void>;
