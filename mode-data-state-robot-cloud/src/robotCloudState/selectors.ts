import {
    PaginationDataSet, RCProjectSettings, RobotStatus, RobotDefinition, FetchRobotFilters, RobotInfo, GatewayDefinition,
}
    from '@moderepo/mode-apis';
import {
    searchParamsToString,
} from '@moderepo/mode-data-state-base';
import createCachedSelector from 're-reselect';
import {
    RCDataState,
} from '../model';
import {
    RobotCloudState,
} from './models';



export const selectRobotCatalog = (state: RCDataState, projectId: number): readonly RobotDefinition[] | undefined => {
    return state.robotCloud.robotCatalogByProjectId[projectId];
};



/**
 * Select RobotCloudProjectSettings for a specific project
 */
export const selectRobotCloudProjectSettings = (state: RCDataState, projectId: number): RCProjectSettings | undefined => {
    return state.robotCloud.robotCloudProjectSettingsById[projectId];
};



/**
 * Select RobotStatus for a specific robot
 */
export const selectRobotStatus = (state: RCDataState, homeId: number | undefined, robotId: string | undefined): RobotStatus | undefined => {
    if (homeId && robotId) {
        return state.robotCloud.robotStatusByIdByHomeId[homeId]?.[robotId];
    }
    return undefined;
};



/**
 * This is the actual function that will get the data from the state and return the data requested. However, this function returns a new
 * object every time which can cause an infinite loop in re-rendering if used in React component. Therefore this function is not EXPORTED
 * and we will create another function below which use memoize to cache the result.
 */
const selectRobotsStatusesFunc = (
    robotStatusByIdByHomeId: RobotCloudState['robotStatusByIdByHomeId'],
    homeIdRobotIdPairs: readonly [number, string][],
): readonly (RobotStatus | undefined) [] => {
    return homeIdRobotIdPairs.map(([homeId, robotId]: [homeId:number, robotId:string]): RobotStatus | undefined => {
        if (robotStatusByIdByHomeId[homeId]) {
            return robotStatusByIdByHomeId[homeId]?.[robotId];
        }
        return undefined;
    });
};


/**
 * Select robots' health status for a list of robot ids
 * @params dataState
 * @param array of [home, robotId] pairs
 */
export const selectRobotsStatuses = createCachedSelector(
    (state: RCDataState) => { return state.robotCloud.robotStatusByIdByHomeId; },
    (state: RCDataState, homeIdRobotIdPairs: readonly [number, string][]) => { return homeIdRobotIdPairs; },
    selectRobotsStatusesFunc,
)((state: RCDataState, homeIdRobotIdPairs: readonly [number, string][]) => {
    return JSON.stringify(homeIdRobotIdPairs);
});



/**
 * This is the actual function that will get the data from the state and return the data requested. However, this function returns a new
 * object every time which can cause an infinite loop in re-rendering if used in React component. Therefore this function is not EXPORTED
 * and we will create another function below which use memoize to cache the result.
 */
const selectRobotsFunc = (
    robotsByIdByHomeId: RobotCloudState['robotsByIdByHomeId'],
    robotIdsByProjectId: RobotCloudState['robotIdsByProjectId'],
    projectId: number,
    searchParams: string,
): PaginationDataSet<RobotInfo> | undefined => {
    const dataSet = robotIdsByProjectId[projectId]?.[searchParams];

    // This will return a new PaginationDataSet of Robots which can cause infinite loop if we don't use memoize
    if (dataSet) {
        return {
            range: dataSet.range,
            items: dataSet.items.reduce((result: readonly RobotInfo[], [homeId, robotId]: [homeId:number, robotId:string]) => {
                const robot = robotsByIdByHomeId[homeId]?.[robotId];
                if (robot) {
                    return [...result, robot];
                }
                return result;
            }, []),
        };
    }
    return undefined;
};



/**
 * This is the public function that components should use to get the cached Robots data.
 * @param state - The data state
 * @param projectId - The project id the Robots belonged to
 * @param filters - The filter options e.g. limit, skip, deviceId, homeId, etc...
 */
export const selectRobots = createCachedSelector(
    (state: RCDataState) => { return state.robotCloud.robotsByIdByHomeId; },
    (state: RCDataState) => { return state.robotCloud.robotIdsByProjectId; },
    (state: RCDataState, projectId: number) => { return projectId; },
    (state: RCDataState, projectId: number, filters: FetchRobotFilters) => {
        return searchParamsToString(filters);
    },
    selectRobotsFunc,
)((state: RCDataState, projectId: number, filters: FetchRobotFilters) => {
    return searchParamsToString(filters);
});


/**
 * Get robot by its id. We will look up the robot from the state's robotsById map
 * @param state
 * @param homeId - The id of the home the robot belonged to. robotId is unique per home BUT not per project therefore we need to know the homeId
 * @param robotId
 */
export const selectRobotById = (state: RCDataState, homeId: number | undefined, robotId: string | undefined): RobotInfo | undefined => {
    if (robotId && homeId) {
        return state.robotCloud.robotsByIdByHomeId[homeId]?.[robotId];
    }
    return undefined;
};


export const selectProjectGatewayCatalog = (state: RCDataState, projectId: number): readonly GatewayDefinition[] | undefined => {
    return state.robotCloud.gatewayCatalogByProjectId[projectId];
};
