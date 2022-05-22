import {
    createCachedSelector,
} from 're-reselect';
import {
    Home, PaginationDataSet,
} from '@moderepo/mode-apis';
import {
    searchParamsToString,
} from '@moderepo/mode-data-state-base';
import {
    UserAppDataState,
} from '../model';
import {
    HomesState,
} from './models';


/**
 * This is the actual function that will get the data from the state and return the data requested. However, this function returns a new
 * object every time which can cause an infinite loop in re-rendering if used in React component. Therefore this function is not EXPORTED
 * and we will create another function below which use memoize to cache the result.
 */
const selectUserHomesFunc = (
    homesById: HomesState['homesById'],
    homeIdsByUserId: HomesState['homeIdsByUserId'],
    userId: number,
    searchParams: string,
): PaginationDataSet<Home> | undefined => {
    const dataSet = homeIdsByUserId[userId]?.[searchParams];
    if (dataSet) {

        // This will return a new PaginationDataSet of Home which can cause infinite loop if we don't use memoize
        return {
            range: dataSet.range,
            items: dataSet.items.reduce((result: readonly Home[], homeId: number) => {
                const home = homesById[homeId];
                if (home) {
                    return [
                        ...result,
                        home,
                    ];
                }
                return result;
            }, []),
        };
    }
    return undefined;
};



/**
 * This is the actual function that will get the data from the state and return the data requested. However, this function returns a new
 * object every time which can cause an infinite loop in re-rendering if used in React component. Therefore this function is not EXPORTED
 * and we will create another function below which use memoize to cache the result.
 */
const selectProjectHomesFunc = (
    homesById: HomesState['homesById'],
    homeIdsByProjectId: HomesState['homeIdsByProjectId'],
    projectId: number,
    searchParams: string,
): PaginationDataSet<Home> | undefined => {
    const dataSet = homeIdsByProjectId[projectId]?.[searchParams];
    if (dataSet) {

        // This will return a new PaginationDataSet of Home which can cause infinite loop if we don't use memoize
        return {
            range: dataSet.range,
            items: dataSet.items.reduce((result: readonly Home[], homeId: number) => {
                const home = homesById[homeId];
                if (home) {
                    return [
                        ...result,
                        home,
                    ];
                }
                return result;
            }, []),
        };
    }
    return undefined;
};



/**
 * Select ALL homes for a specific user
 * @param state
 * @param userId
 * @param searchParams?: {
 *              pageNumber,
 *              pageSize
 *        }
 * @returns PaginationDataSet<Home> | undefined
 */
export const selectUserHomes = createCachedSelector(
    (state: UserAppDataState) => { return state.homes.homesById; },
    (state: UserAppDataState) => { return state.homes.homeIdsByUserId; },
    (state: UserAppDataState, userId: number) => { return userId; },
    (state: UserAppDataState, userId: number, searchParams?: {
        readonly pageNumber?: number | undefined;
        readonly pageSize?: number | undefined;
    }) => { return searchParamsToString(searchParams); },
    selectUserHomesFunc,
)((state: UserAppDataState, userId: number, searchParams?: {
    readonly pageNumber?: number | undefined;
    readonly pageSize?: number | undefined;
}) => {
    // use searchParams as cache key for creatCachedSelector
    return searchParamsToString(searchParams);
});



/**
 * Select ALL homes for a specific user
 * @param state
 * @param projectId
 * @param searchParams?: {
 *              pageNumber,
 *              pageSize
 *        }
 * @returns PaginationDataSet<Home> | undefined
 */
export const selectProjectHomes = createCachedSelector(
    (state: UserAppDataState) => { return state.homes.homesById; },
    (state: UserAppDataState) => { return state.homes.homeIdsByProjectId; },
    (state: UserAppDataState, projectId: number) => { return projectId; },
    (state: UserAppDataState, projectId: number, searchParams?: {
        readonly pageNumber?: number | undefined;
        readonly pageSize?: number | undefined;
    }) => { return searchParamsToString(searchParams); },
    selectProjectHomesFunc,
)((state: UserAppDataState, projectId: number, searchParams?: {
    readonly pageNumber?: number | undefined;
    readonly pageSize?: number | undefined;
}) => {
    // use searchParams as cache key for creatCachedSelector
    return searchParamsToString(searchParams);
});



/**
 * @param state
 * @param homeId
 * @returns Home | undefined
 */
export const selectHomeById = (state: UserAppDataState, homeId: number): Home | undefined => {
    return state.homes.homesById[homeId];
};
