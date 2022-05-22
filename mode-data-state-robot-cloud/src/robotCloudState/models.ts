import {
    PaginationDataSet, RCProjectSettings, RobotStatus, RobotDefinition, RobotInfo, GatewayDefinition,
} from '@moderepo/mode-apis';


export interface RobotCloudState {
    readonly robotCatalogByProjectId: {[projectId: number]: readonly RobotDefinition[] | undefined};
    readonly robotCloudProjectSettingsById: {[projectId: number]: RCProjectSettings};

    readonly robotStatusByIdByHomeId: {
        readonly [homeId: number]: {
            readonly [robotId: string]: RobotStatus | undefined;
        } | undefined;
    };
    // NOTE: robotId are not unique globally. They are unique within a home therefore they need to be stored under homeId
    readonly robotsByIdByHomeId: {
        readonly [homeId: number]: {
            readonly [robotId: string]: RobotInfo | undefined;
        } | undefined;
    };
    // NOTE: robotId are not unique globally. They are unique within a home therefore the result need to contain both [homeId, robotId]
    readonly robotIdsByProjectId: {
        readonly [projectId: number]: {
            readonly [searchParams: string]: PaginationDataSet<[number, string]> | undefined;
        } | undefined;
    }
    // The list of device classes that are used as Gateways
    readonly gatewayCatalogByProjectId: {
        [projectId: number]: readonly GatewayDefinition[] | undefined;
    };
}


export const initialRobotCloudState: RobotCloudState = {
    robotCatalogByProjectId: {
    },
    robotCloudProjectSettingsById: {
    },
    robotStatusByIdByHomeId: {
    },
    robotsByIdByHomeId: {
    },
    robotIdsByProjectId: {
    },
    gatewayCatalogByProjectId: {
    },
};
