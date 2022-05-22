import produce, {
    castDraft, Draft,
} from 'immer';
import {
    SmartModule,
} from '@moderepo/mode-apis';
import {
    BaseAction,
} from '@moderepo/mode-data-state-base';
import {
    HomeSmartModulesActionType, SetHomeSmartModulesAction,
} from './actions';
import {
    HomeSmartModulesState,
} from './models';


const homeSmartModulesByIdReducer = (
    currentState: HomeSmartModulesState['smartModulesById'], action: BaseAction,
): HomeSmartModulesState['smartModulesById'] => {
    const { type } = action;

    switch (type) {
        case HomeSmartModulesActionType.SET_HOME_SMART_MODULES:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetHomeSmartModulesAction;

                actualAction.modules.forEach((module: SmartModule) => {
                    draft[module.id] = module;
                });
            });

        default:
            return currentState;
    }
};


const allHomeSmartModuleIdsReducer = (currentState: readonly string[] | undefined, action: BaseAction): readonly string[]|undefined => {
    const { type } = action;
    switch (type) {
        case HomeSmartModulesActionType.SET_HOME_SMART_MODULES:
            return produce(currentState, () => {
                const actualAction = action as SetHomeSmartModulesAction;

                // convert the list of actualAction.modules to an Array of modules ids and update the currentState with the new
                // list. NOTE: only need to update the currentState if NOT both of them are empty. If both of them are empty,
                // do not need to run this or else it will replace the currentState with a NEW empty array which cause unnecessary
                // UI re-render.
                if (actualAction.modules.length !== 0 || !currentState || currentState.length !== 0) {
                    return actualAction.modules.map((module: SmartModule): string => {
                        return module.id;
                    });
                }

                return currentState;
            });

        default:
            return currentState;
    }
};


const homeSmartModuleIdsByHomeIdReducer = (
    currentState: HomeSmartModulesState['smartModuleIdsByHomeId'], action: BaseAction,
): HomeSmartModulesState['smartModuleIdsByHomeId'] => {

    const { type } = action;

    switch (type) {
        case HomeSmartModulesActionType.SET_HOME_SMART_MODULES:

            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const { homeId } = action as SetHomeSmartModulesAction;
                draft[homeId] = castDraft(allHomeSmartModuleIdsReducer(currentState[homeId], action));
            });

        default:
            return currentState;
    }
};



export const homeSmartModulesStateReducer = (currentState: HomeSmartModulesState, action: BaseAction): HomeSmartModulesState => {
    return produce(currentState, (draft: Draft<HomeSmartModulesState>) => {
        draft.smartModulesById = homeSmartModulesByIdReducer(currentState.smartModulesById, action);
        draft.smartModuleIdsByHomeId = castDraft(homeSmartModuleIdsByHomeIdReducer(currentState.smartModuleIdsByHomeId, action));
    });
};
