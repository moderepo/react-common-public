import produce, {
    castDraft, Draft,
} from 'immer';
import {
    RobotInfo,
} from '@moderepo/mode-apis';
import {
    BaseAction,
} from '@moderepo/mode-data-state-base';
import {
    RobotCloudActionType, SetRobotCatalogAction, SetRobotCloudProjectSettingsAction, SetRobotStatusAction, SetRobotsAction,
    SetRobotAction, ClearRobotsAction, SetProjectGatewayCatalogAction,
} from './actions';
import {
    RobotCloudState,
} from './models';



const robotCatalogByProjectIdReducer = (
    currentState: RobotCloudState['robotCatalogByProjectId'], action: BaseAction,
): RobotCloudState['robotCatalogByProjectId'] => {
    const { type } = action;

    switch (type) {
        case RobotCloudActionType.SET_ROBOT_CATALOG:

            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetRobotCatalogAction;
                draft[actualAction.projectId] = castDraft(actualAction.robotCatalog);
            });

        default:
            return currentState;
    }
};



const robotCloudProjectSettingsByIdReducer = (
    currentState: RobotCloudState['robotCloudProjectSettingsById'], action: BaseAction,
): RobotCloudState['robotCloudProjectSettingsById'] => {
    const { type } = action;

    switch (type) {
        case RobotCloudActionType.SET_PROJECT_SETTINGS:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetRobotCloudProjectSettingsAction;
                draft[actualAction.projectId] = castDraft(actualAction.settings);
            });

        default:
            return currentState;
    }
};



const robotStatusByIdByHomeIdReducer = (
    currentState: RobotCloudState['robotStatusByIdByHomeId'], action: BaseAction,
): RobotCloudState['robotStatusByIdByHomeId'] => {
    const { type } = action;

    switch (type) {
        case RobotCloudActionType.SET_ROBOT_STATUS:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetRobotStatusAction;
                const temp = draft[actualAction.homeId] || {
                };
                draft[actualAction.homeId] = temp;

                temp[actualAction.robotId] = castDraft(actualAction.status);
            });

        default:
            return currentState;
    }
};


const robotsByIdByHomeIdReducer = (
    currentState: RobotCloudState['robotsByIdByHomeId'], action: BaseAction,
): RobotCloudState['robotsByIdByHomeId'] => {
    const { type } = action;

    switch (type) {
        case RobotCloudActionType.SET_ROBOTS:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetRobotsAction;
                const { robots } = actualAction;

                robots.items.forEach((robot: RobotInfo) => {
                    const temp = draft[robot.homeId] || {
                    };
                    draft[robot.homeId] = temp;

                    temp[robot.id] = castDraft(robot);
                });
            });

        case RobotCloudActionType.SET_ROBOT:
            // When a robot is updated, we need to update the associated robot in the map of robots by id
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetRobotAction;
                const temp = draft[actualAction.robot.homeId] || {
                };
                draft[actualAction.robot.homeId] = temp;

                temp[actualAction.robot.id] = castDraft(actualAction.robot);
            });

        default:
            return currentState;
    }
};



const robotIdsByProjectIdReducer = (
    currentState: RobotCloudState['robotIdsByProjectId'], action: BaseAction,
): RobotCloudState['robotIdsByProjectId'] => {

    const { type } = action;

    switch (type) {
        case RobotCloudActionType.SET_ROBOTS:

            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetRobotsAction;

                // actualAction.robots contains the complete Robot data. However, we only need to save the list of robot IDs
                const temp = draft[actualAction.projectId] || {
                };
                draft[actualAction.projectId] = temp;


                // actualAction.robots contains the complete Robot data. However, we only need to save the list of [homeId, robot Id] pairs
                temp[actualAction.searchParams] = {
                    range: actualAction.robots.range,
                    items: actualAction.robots.items.map((robot: RobotInfo) => {
                        return [robot.homeId, robot.id];
                    }),
                };
            });

        case RobotCloudActionType.CLEAR_ROBOTS:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as ClearRobotsAction;
                delete draft[actualAction.projectId];
            });


        default:
            return currentState;
    }
};


const gatewayCatalogByProjectIdReducer = (
    currentState: RobotCloudState['gatewayCatalogByProjectId'], action: BaseAction,
): RobotCloudState['gatewayCatalogByProjectId'] => {
    const { type } = action;

    switch (type) {
        case RobotCloudActionType.SET_PROJECT_GATEWAY_CATALOG:

            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetProjectGatewayCatalogAction;
                draft[actualAction.projectId] = castDraft(actualAction.gatewayCatalog);
            });

        default:
            return currentState;
    }
};


export const robotCloudStateReducer = (currentState: RobotCloudState, action: BaseAction): RobotCloudState => {
    return produce(currentState, (draft: Draft<RobotCloudState>) => {
        draft.robotCatalogByProjectId = castDraft(robotCatalogByProjectIdReducer(currentState.robotCatalogByProjectId, action));
        draft.robotCloudProjectSettingsById = castDraft(robotCloudProjectSettingsByIdReducer(currentState.robotCloudProjectSettingsById, action));
        draft.robotStatusByIdByHomeId = castDraft(robotStatusByIdByHomeIdReducer(currentState.robotStatusByIdByHomeId, action));

        draft.robotsByIdByHomeId = castDraft(robotsByIdByHomeIdReducer(currentState.robotsByIdByHomeId, action));
        draft.robotIdsByProjectId = castDraft(robotIdsByProjectIdReducer(currentState.robotIdsByProjectId, action));
        draft.gatewayCatalogByProjectId = castDraft(gatewayCatalogByProjectIdReducer(currentState.gatewayCatalogByProjectId, action));
    });
};
