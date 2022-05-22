import {
    PaginationDataSet, RobotCloudAPI, RCProjectSettings, RobotStatus, RobotDefinition, RobotInfo, FetchRobotFilters, GatewayDefinition,
    UpdatableRCProjectSettings,
} from '@moderepo/mode-apis';
import {
    ExtDispatch, BaseAction, searchParamsToString,
} from '@moderepo/mode-data-state-base';
import {
    RCDataStateAction, RCThunkAction,
} from '../actions';



/**
 * The types of action that can be dispatched to update this sub state.
 */
export enum RobotCloudActionType {
    SET_ROBOT_CATALOG = 'set project robot definitions',
    SET_PROJECT_SETTINGS = 'set project settings',
    SET_ROBOT_STATUS = 'set robot status',
    SET_ROBOTS = 'set robots',
    SET_ROBOT = 'set robot',
    CLEAR_ROBOTS = 'clear robots',
    SET_PROJECT_GATEWAY_CATALOG = 'set project gateway definitions',
}



export interface SetRobotCatalogAction extends BaseAction {
    readonly type: RobotCloudActionType.SET_ROBOT_CATALOG;
    readonly projectId: number;
    readonly robotCatalog: readonly RobotDefinition[];
}



/**
 * The action interface for setting RobotCloud project settings
 */
export interface SetRobotCloudProjectSettingsAction extends BaseAction {
    readonly type: RobotCloudActionType.SET_PROJECT_SETTINGS;
    readonly projectId: number;
    readonly settings: RCProjectSettings;
}


/**
 * The action interface for setting a robot health status to the state
 * @param robotId - The id of the robot that the status belonged to
 * @param status - The robot health status object
 */
export interface SetRobotStatusAction extends BaseAction {
    readonly type: RobotCloudActionType.SET_ROBOT_STATUS;
    readonly homeId: number;
    readonly robotId: string;
    readonly status: RobotStatus;
}



/**
 * The Action interface for setting a list of robots that belonged to a project.
 * @param type - The action type
 * @param projectId - The project id
 * @param robots - The array of robots
 */
export interface SetRobotsAction extends BaseAction {
    readonly type: RobotCloudActionType.SET_ROBOTS;
    readonly projectId: number;
    readonly robots: PaginationDataSet<RobotInfo>;
    readonly searchParams: string;
}



/**
 * The action interface for setting a project's robot.
 * @param type - The action type
 * @param projectId - The project id
 * @param robot - The project robot we want to set.
 */
export interface SetRobotAction extends BaseAction {
    readonly type: RobotCloudActionType.SET_ROBOT;
    readonly projectId: number;
    readonly robot: RobotInfo;
}


/**
 * The action interface for clearing all the robots from cache.
 */
export interface ClearRobotsAction extends BaseAction {
    readonly type: RobotCloudActionType.CLEAR_ROBOTS;
    readonly projectId: number;
}


export interface SetProjectGatewayCatalogAction extends BaseAction {
    readonly type: RobotCloudActionType.SET_PROJECT_GATEWAY_CATALOG;
    readonly projectId: number;
    readonly gatewayCatalog: readonly GatewayDefinition[];
}



export const setRobotCatalog = (projectId: number, robotCatalog: readonly RobotDefinition[]): SetRobotCatalogAction => {
    return {
        type: RobotCloudActionType.SET_ROBOT_CATALOG,
        projectId,
        robotCatalog,
    };
};



export const setRobotCloudProjectSettings = (projectId: number, settings: RCProjectSettings): SetRobotCloudProjectSettingsAction => {
    return {
        type: RobotCloudActionType.SET_PROJECT_SETTINGS,
        projectId,
        settings,
    };
};


export const setRobotStatus = (homeId: number, robotId: string, status: RobotStatus): SetRobotStatusAction => {
    return {
        type: RobotCloudActionType.SET_ROBOT_STATUS,
        homeId,
        robotId,
        status,
    };
};


export const setRobots = (projectId: number, robots: PaginationDataSet<RobotInfo>, searchParams: any): SetRobotsAction => {
    return {
        type: RobotCloudActionType.SET_ROBOTS,
        projectId,
        robots,
        searchParams,
    };
};


export const setRobot = (projectId: number, robot: RobotInfo): SetRobotAction => {
    return {
        type: RobotCloudActionType.SET_ROBOT,
        projectId,
        robot,
    };
};


export const clearRobots = (projectId: number): ClearRobotsAction => {
    return {
        type: RobotCloudActionType.CLEAR_ROBOTS,
        projectId,
    };
};


export const setProjectGatewayCatalog = (projectId: number, gatewayCatalog: readonly GatewayDefinition[]): SetProjectGatewayCatalogAction => {
    return {
        type: RobotCloudActionType.SET_PROJECT_GATEWAY_CATALOG,
        projectId,
        gatewayCatalog,
    };
};


/**
 * Fetch Robot Definitions for the whole project
 * @param projectId
 */
export const fetchRobotCatalog = (projectId: number): RCThunkAction => {
    return async (dataDispatch: ExtDispatch<RCDataStateAction>): Promise<void> => {
        try {
            const robotDef = await RobotCloudAPI.getInstance().getRobotCatalog(projectId);
            // Robot Definition loaded successfully, dispatch an action to add them to the state
            dataDispatch(setRobotCatalog(projectId, robotDef));
        } catch (error) {
            // Robot Definition failed to load. Robot Catalog is OPTIONAL so if it failed to load, we will treat it as having NO robot definition
            // instead of throwing an error. Therefore, if getRobotCatalog call failed, we will call setRobotCatalog
            // and give it an empty array and return the array.
            dataDispatch(setRobotCatalog(projectId, []));
        }
    };
};



/**
 * @param projectId - The id of the project the project settings
 */
export const fetchRobotCloudProjectSettings = (projectId: number): RCThunkAction => {
    return async (dataDispatch: ExtDispatch<RCDataStateAction>): Promise<void> => {
        const settings = await RobotCloudAPI.getInstance().getProjectSettings(projectId);
        dataDispatch(setRobotCloudProjectSettings(projectId, settings));
    };
};



/**
 * @param projectId - The id of the project the project settings
 */
export const updateRobotCloudProjectSettings = (projectId: number, settings: UpdatableRCProjectSettings): RCThunkAction => {
    return async (dataDispatch: ExtDispatch<RCDataStateAction>): Promise<void> => {
        await RobotCloudAPI.getInstance().updateProjectSettings(projectId, settings);
        await dataDispatch(fetchRobotCloudProjectSettings(projectId));
    };
};


/**
 * Fetch status for 1 robot
 * @param homeId - The id of the project the robot belonged to
 * @param robotId - The id of the robot we want to fetch status for
 */
export const fetchRobotStatus = (homeId: number, robotId: string): RCThunkAction => {
    return async (dataDispatch: ExtDispatch<RCDataStateAction>): Promise<void> => {
        const status = await RobotCloudAPI.getInstance().getRobotStatus(homeId, robotId);
        await dataDispatch(setRobotStatus(status.homeId, robotId, status));
    };
};


/**
 * Fetch status for multiple robots
 * @param homeId - The id of the project the robot belonged to
 * @param robotIds - The ids of the robots we want to fetch status for
 */
export const fetchRobotsStatuses = (homeId: number, robotIds: readonly string[]): RCThunkAction => {
    return async (dataDispatch: ExtDispatch<RCDataStateAction>): Promise<void> => {
        const statuses = await RobotCloudAPI.getInstance().getRobotStatusesByIds(homeId, robotIds);
        statuses.forEach((status: RobotStatus) => {
            dataDispatch(setRobotStatus(status.homeId, status.robotId, status));
        });
    };
};



/**
 * Backend uses 'limit' and 'skip' attributes however in the frontend, we use pageNumber and pageSize so this function need
 * to accept a filter object that uses pageNumber, pageSize and then convert that to skip/limit before calling the API
 */
export interface UIFetchRobotFilters extends Omit<Omit<FetchRobotFilters, 'skip'>, 'limit'> {
    readonly pageNumber: number;
    readonly pageSize: number;
}


/**
 * Get all robots for a project with the given filters
 * @param projectId - The id of the project
 */
export const fetchRobots = (projectId: number, filters: UIFetchRobotFilters): RCThunkAction => {
    return async (dataDispatch: ExtDispatch<RCDataStateAction>): Promise<void> => {
        const modifiedFilters = {
            ...filters,                                             // Copy the filters
            skip      : filters.pageNumber * filters.pageSize,      // change pageSize/pageNumber to skip/limit
            limit     : filters.pageSize ?? 0,
            pageNumber: undefined,                                  // exclude pageSize/pageNumber
            pageSize  : undefined,
        };

        const robots = await RobotCloudAPI.getInstance().getRobots(projectId, modifiedFilters);
        await dataDispatch(setRobots(projectId, robots, searchParamsToString(filters)));
    };
};



/**
 * Get 1 robot
 * @param projectId - The id of the project
 * @param robotId - The id of the robot
 */
export const fetchRobotById = (
    projectId: number,
    homeId: number,
    robotId: string,
): RCThunkAction => {
    return async (dataDispatch: ExtDispatch<RCDataStateAction>): Promise<void> => {
        const robot = await RobotCloudAPI.getInstance().getRobotById(homeId, robotId);
        await dataDispatch(setRobot(projectId, robot));
    };
};


/**
 * Create a robot
 * @param projectId - The id of the project
 * @param robotId - The id of the robot
 */
export const createRobot = (
    projectId: number,
    homeId: number,
    data: {
        readonly id: string;
        readonly deviceId?: number;
        readonly name?: string;
        readonly robotClass: string;
        readonly driverName?: string;
        readonly overrideRobotDefinition?: RobotDefinition
    },
): RCThunkAction => {
    return async (dataDispatch: ExtDispatch<RCDataStateAction>): Promise<void> => {
        await RobotCloudAPI.getInstance().createRobot(homeId, data);
        await dataDispatch(clearRobots(projectId));
    };
};



/**
 * Update a robot
 * @param projectId - The id of the project
 * @param robotId - The id of the robot
 */
export const updateRobot = (
    projectId: number,
    homeId: number,
    robotId: string,
    data: {
        readonly deviceId?: number | null | undefined;
        readonly name?: string | null | undefined;
        readonly driverName?: string | null | undefined;
        readonly overrideRobotDefinition?: RobotDefinition | null | undefined;
    },
): RCThunkAction => {
    return async (dataDispatch: ExtDispatch<RCDataStateAction>): Promise<void> => {
        await RobotCloudAPI.getInstance().updateRobot(homeId, robotId, data);
        if (data.deviceId !== undefined) {
            // if deviceId is a number or NULL, that means it changed. We need to clear the robots list and reload new one because the list is
            // no longer valid.
            await dataDispatch(clearRobots(projectId));
        } else {
            // refetch robot info
            await dataDispatch(fetchRobotById(projectId, homeId, robotId));
        }
    };
};



/**
 * Get 1 robot
 * @param projectId - The id of the project
 * @param robotId - The id of the robot
 */
export const deleteRobot = (
    projectId: number,
    homeId: number,
    robotId: string,
): RCThunkAction => {
    return async (dataDispatch: ExtDispatch<RCDataStateAction>): Promise<void> => {
        await RobotCloudAPI.getInstance().deleteRobot(homeId, robotId);
        await dataDispatch(clearRobots(projectId));
    };
};



/**
 * Fetch Gate Definitions for the whole project
 * @param projectId
 */
export const fetchRCProjectGatewayCatalog = (projectId: number): RCThunkAction => {
    return async (dataDispatch: ExtDispatch<RCDataStateAction>): Promise<void> => {
        try {
            const gatewayDef = await RobotCloudAPI.getInstance().getGatewayCatalog(projectId);
            // Gateway Definition loaded successfully, dispatch an action to add them to the state
            await dataDispatch(setProjectGatewayCatalog(projectId, gatewayDef));
        } catch (error) {
            // Gateway Definition failed to load. GatewayDefinition is OPTIONAL so if it failed to load, we will treat it as having NO gateway
            // definition instead of throwing an error. Therefore, if getAllGatewayCatalog call failed, we will call setProjectGatewayCatalog
            // and give it an empty array and return the array.
            await dataDispatch(setProjectGatewayCatalog(projectId, []));
        }
    };
};
