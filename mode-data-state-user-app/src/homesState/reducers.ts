import produce, {
    castDraft, Draft,
} from 'immer';
import {
    Home,
} from '@moderepo/mode-apis';
import {
    BaseAction,
} from '@moderepo/mode-data-state-base';
import {
    SetUserHomesAction, HomesActionType, SetHomeAction, ClearUserHomesAction, SetProjectHomesAction, ClearProjectHomesAction,
} from './actions';
import {
    HomesState,
} from './models';


const homesByIdReducer = (
    currentState: HomesState['homesById'], action: BaseAction,
): HomesState['homesById'] => {
    const { type } = action;

    switch (type) {
        case HomesActionType.SET_USER_HOMES:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetUserHomesAction;

                actualAction.homes.items.forEach((home: Home) => {
                    draft[home.id] = home;
                });
            });

        case HomesActionType.SET_PROJECT_HOMES:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetProjectHomesAction;
    
                actualAction.homes.items.forEach((home: Home) => {
                    draft[home.id] = home;
                });
            });

        case HomesActionType.SET_HOME:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetHomeAction;
                draft[actualAction.home.id] = actualAction.home;
            });

        default:
            return currentState;
    }
};



const homeIdsByUserIdReducer = (
    currentState: HomesState['homeIdsByUserId'], action: BaseAction,
): HomesState['homeIdsByUserId'] => {

    const { type } = action;

    switch (type) {
        case HomesActionType.SET_USER_HOMES:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetUserHomesAction;
                const temp = draft[actualAction.userId] || {
                };
                draft[actualAction.userId] = temp;
                temp[actualAction.searchParams] = {
                    range: actualAction.homes.range,
                    items: actualAction.homes.items.map((home: Home): number => {
                        return home.id;
                    }),
                };
            });

        case HomesActionType.CLEAR_USER_HOMES:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const { userId } = action as ClearUserHomesAction;
                delete draft[userId];
            });

        default:
            return currentState;
    }
};



const homeIdsByProjectIdReducer = (
    currentState: HomesState['homeIdsByProjectId'], action: BaseAction,
): HomesState['homeIdsByProjectId'] => {

    const { type } = action;

    switch (type) {
        case HomesActionType.SET_PROJECT_HOMES:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetProjectHomesAction;
                const temp = draft[actualAction.projectId] || {
                };
                draft[actualAction.projectId] = temp;
                temp[actualAction.searchParams] = {
                    range: actualAction.homes.range,
                    items: actualAction.homes.items.map((home: Home): number => {
                        return home.id;
                    }),
                };
            });

        case HomesActionType.CLEAR_PROJECT_HOMES:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const { projectId } = action as ClearProjectHomesAction;
                delete draft[projectId];
            });

        default:
            return currentState;
    }
};



export const homesStateReducer = (currentState: HomesState, action: BaseAction): HomesState => {
    return produce(currentState, (draft: Draft<HomesState>) => {
        draft.homesById = homesByIdReducer(currentState.homesById, action);
        draft.homeIdsByUserId = castDraft(homeIdsByUserIdReducer(currentState.homeIdsByUserId, action));
        draft.homeIdsByProjectId = castDraft(homeIdsByProjectIdReducer(currentState.homeIdsByProjectId, action));
    });
};
