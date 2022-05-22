import {
    AppAPI, Home, PaginationDataSet,
} from '@moderepo/mode-apis';
import {
    BaseAction, ExtDispatch, searchParamsToString,
} from '@moderepo/mode-data-state-base';
import {
    UserAppDataStateAction, UserAppThunkAction,
} from '../actions';


/**
 * The types of action that can be dispatched to update this sub state.
 */
export enum HomesActionType {
    SET_USER_HOMES = 'set user homes',
    SET_HOME = 'set home',
    SET_PROJECT_HOMES = 'set project homes',
    CLEAR_USER_HOMES = 'clear user homes',
    CLEAR_PROJECT_HOMES = 'clear project homes',
}



/**
 * The Action interface for setting a list of homes that belonged to a user.
 * @param type - The action type
 * @param homes - The array of homes
 */
export interface SetUserHomesAction extends BaseAction {
    readonly type: HomesActionType.SET_USER_HOMES;
    readonly userId: number;
    readonly homes: PaginationDataSet<Home>;
    readonly searchParams: string;
}


/**
 * The Action interface for setting a list of homes that belonged to a project.
 * @param type - The action type
 * @param homes - The array of homes
 */
export interface SetProjectHomesAction extends BaseAction {
    readonly type: HomesActionType.SET_PROJECT_HOMES;
    readonly projectId: number;
    readonly homes: PaginationDataSet<Home>;
    readonly searchParams: string;
}


/**
 * The Action interface for setting a home that belonged to a user.
 * @param type - The action type
 * @param home - The home
 */
export interface SetHomeAction extends BaseAction {
    readonly type: HomesActionType.SET_HOME;
    readonly home: Home;
}


/**
 * The Action interface for clearing the list of user homes
 * @param type - The action type
 */
export interface ClearUserHomesAction extends BaseAction {
    readonly type: HomesActionType.CLEAR_USER_HOMES;
    readonly userId: number;
}


/**
 * The Action interface for clearing the list of project homes
 * @param type - The action type
 */
export interface ClearProjectHomesAction extends BaseAction {
    readonly type: HomesActionType.CLEAR_PROJECT_HOMES;
    readonly projectId: number;
}



export const setUserHomes = (userId: number, homes: PaginationDataSet<Home>, searchParams: string): SetUserHomesAction => {
    return {
        type: HomesActionType.SET_USER_HOMES,
        userId,
        homes,
        searchParams,
    };
};


export const setProjectHomes = (projectId: number, homes: PaginationDataSet<Home>, searchParams: string): SetProjectHomesAction => {
    return {
        type: HomesActionType.SET_PROJECT_HOMES,
        projectId,
        homes,
        searchParams,
    };
};



export const setHome = (home: Home): SetHomeAction => {
    return {
        type: HomesActionType.SET_HOME,
        home,
    };
};


export const clearUserHomes = (userId: number): ClearUserHomesAction => {
    return {
        type: HomesActionType.CLEAR_USER_HOMES,
        userId,
    };
};


export const clearProjectHomes = (projectId: number): ClearProjectHomesAction => {
    return {
        type: HomesActionType.CLEAR_PROJECT_HOMES,
        projectId,
    };
};


/**
 * Get all homes belonged to a user
 * @param userId - The id of the user to look for
 */
export const fetchUserHomes = (userId: number, pageNumber?: number, pageSize?: number): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction
    >): Promise<void> => {
        const homes = await AppAPI.getInstance().getUserHomes(
            userId, pageNumber !== undefined && pageSize !== undefined ? pageNumber * pageSize : undefined, pageSize,
        );
        await dataDispatch(setUserHomes(userId, homes, searchParamsToString({
            pageNumber, pageSize,
        })));
    };
};



/**
 * Get all homes belonged to a Project
 * @param projectId - The id of the project to look for
 */
export const fetchProjectHomes = (
    projectId: number, pageNumber?: number, pageSize?: number, projectApiKey?: string | undefined,
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction
    >): Promise<void> => {
        const homes = await AppAPI.getInstance().getProjectHomes(
            projectId, pageNumber !== undefined && pageSize !== undefined ? pageNumber * pageSize : undefined, pageSize, projectApiKey,
        );
        await dataDispatch(setProjectHomes(projectId, homes, searchParamsToString({
            pageNumber, pageSize,
        })));
    };
};



/**
 * Get a home by id. This action will also update the app state.
 *
 * @param homeId - The ID of the home we want to get
 */
export const fetchHomeById = (homeId: number): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction
    >): Promise<void> => {
        const home = await AppAPI.getInstance().getHomeById(homeId);
        await dataDispatch(setHome(home));
    };
};



/**
 * Create a new home. This will create a new home AND automatically link the new home to a user if the API key set in the AppAPI
 * is a user key. If the API key is a project key then the home will not be linked to a user.
 * NOTE: this action will not automatically clear the user homes or project homes because it doesn't know if the home is linked to a user.
 * Therefore, it is up to the caller to call the appropriate clearUserHomes, or clearProjectHomes or both depending on how it is used.
 * @param homeName - The name of the home we want to create
 */
export const createHome = (homeName: string): UserAppThunkAction => {
    return async (): Promise<void> => {
        await AppAPI.getInstance().createHome(homeName);
    };
};


/**
 * Delete a home. NOTE that this will delete a home from a project, not just removing the user from a home. If there are more than 1 member
 * in this home, all those members will be removed from this home as well. To remove only 1 user, use 'removeHomeMember' action instead
 * @param homeId - The id of the home we want to remove from the user
 */
export const deleteHome = (homeId: number): UserAppThunkAction => {
    return async (): Promise<void> => {
        await AppAPI.getInstance().deleteHome(homeId);
    };
};


/**
 * Update a home
 * @param homeId - The ID of the home we want to update
 * @param name - The new name of the home
 */
export const updateHome = (homeId: number, name: string): UserAppThunkAction => {
    return async (): Promise<void> => {
        return await AppAPI.getInstance().updateHome(homeId, name);
    };
};
