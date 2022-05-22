import {
    createCachedSelector,
} from 're-reselect';
import {
    SmartModule, SmartModuleType,
} from '@moderepo/mode-apis';
import {
    UserAppDataState,
} from '../model';
import {
    HomeSmartModulesState,
} from './models';



/**
 * This is the actual function that will get the data from the state and return the data requested. However, this function returns a new
 * object every time which can cause an infinite loop in re-rendering if used in React component. Therefore this function is not EXPORTED
 * and we will create another function below which use memoize to cache the result.
 */
const selectAllHomeSmartModulesFunc = (
    smartModulesById: HomeSmartModulesState['smartModulesById'],
    smartModuleIdsByHomeId: HomeSmartModulesState['smartModuleIdsByHomeId'],
    homeId: number,
): readonly SmartModule[] | undefined => {
    return smartModuleIdsByHomeId?.[homeId]?.reduce((result: readonly SmartModule[], moduleId: string) => {
        // first convert all smartModuleId to SmartModule
        const module = smartModulesById[moduleId];
        if (module) {
            return [...result, module];
        }
        return result;
    }, []);
};


/**
 * Select ALL smart modules for a specific home
 */
export const selectAllHomeSmartModules = createCachedSelector(
    (state: UserAppDataState) => { return state.homeSmartModules.smartModulesById; },
    (state: UserAppDataState) => { return state.homeSmartModules.smartModuleIdsByHomeId; },
    (state: UserAppDataState, homeId: number) => { return homeId; },
    selectAllHomeSmartModulesFunc,
)((state: UserAppDataState, homeId: number) => {
    // use homeId as cache key for createCachedSelector
    return homeId.toString();
});



/**
 * This is the actual function that will get the data from the state and return the data requested. However, this function returns a new
 * object every time which can cause an infinite loop in re-rendering if used in React component. Therefore this function is not EXPORTED
 * and we will create another function below which use memoize to cache the result.
 */
const selectHomeSmartModulesByTypeFunc = (
    smartModulesById: HomeSmartModulesState['smartModulesById'],
    smartModuleIdsByHomeId: HomeSmartModulesState['smartModuleIdsByHomeId'],
    homeId: number,
    moduleType: SmartModuleType,
): readonly SmartModule[] | undefined => {
    return smartModuleIdsByHomeId?.[homeId]?.reduce((result: readonly SmartModule[], moduleId: string) => {
        // first convert all smartModuleId to SmartModule
        const module = smartModulesById[moduleId];
        if (module) {
            return [...result, module];
        }
        return result;
    }, []).filter((smartModule: SmartModule) => {
        // filter out smart module that is not the same type as the specified type
        return smartModule.moduleType === moduleType;
    });
};


/**
 * Select a home smart modules by module type. This will return the ALL smart module instances of the specified type
 */
export const selectHomeSmartModulesByType = createCachedSelector(
    (state: UserAppDataState) => { return state.homeSmartModules.smartModulesById; },
    (state: UserAppDataState) => { return state.homeSmartModules.smartModuleIdsByHomeId; },
    (state: UserAppDataState, homeId: number) => { return homeId; },
    (state: UserAppDataState, homeId: number, moduleType: SmartModuleType) => { return moduleType; },
    selectHomeSmartModulesByTypeFunc,
)((state: UserAppDataState, homeId: number, moduleType: SmartModuleType) => {
    // use combination of homeId and moduleType as cache key for createCachedSelector
    return `${homeId}:${moduleType}`;
});



/**
 * Select a home smart module by module type. This will return only the FIRST smart module it find that is of the specified type
 * @param state
 * @param homeId
 * @param moduleType
 */
export const selectHomeSmartModuleByType = (state: UserAppDataState, homeId: number, moduleType: SmartModuleType): SmartModule | undefined => {
    const homeSmartModules = selectAllHomeSmartModules(state, homeId);
    if (homeSmartModules) {
        return homeSmartModules.find((module: SmartModule): boolean => {
            return module.moduleType === moduleType;
        });
    }
    return undefined;
};



/**
 * Select a home smart module by module id
 * @param state
 * @param moduleId
 */
export const selectHomeSmartModuleById = (state: UserAppDataState, moduleId: string): SmartModule | undefined => {
    return state.homeSmartModules.smartModulesById[moduleId];
};
