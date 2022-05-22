import {
    RobotHealthCondition, RobotDefinition, NumericMetricInfo, TagMetricInfo,
} from '@moderepo/mode-apis';
import {
    sortMetrics,
} from '../timeSeriesUtils';


/**
 * This is where we define all CONSTANTS and UTIL functions used only by Robot Cloud projects. We don't want to add these
 * to the global utils or constants files because if we ever need to stop supporting robot cloud or remove robot cloud code,
 * we can do it easily just buy deleting this file.
 */


/**
 * We will use device's KV Store to store Robot Definition for each robot. These KV Store are used internally by the App Proxy and they are not meant
 * for the Agent to mess with so we will give them a special name which starts with 'MODE_'. All KV Stores that has prefix 'MODE_' will be hidden
 * from the agent.
 */
export const ROBOT_DEFINITION_KV_STORE_NAME: string = 'MODE_robotDefinition';

// We use Device KV store to store RobotInfo and the key naming convention is "Robot:${robotId}". The ket prefix is "Robot:"
export const ROBOT_INFO_KV_STORE_PREFIX: string = 'Robot:';

// Robot ID format
export const ROBOT_ID_REGEX = /^[A-Za-z0-9][A-Za-z0-9_]+$/;



/**
  * Given a robotClass, find the Robot Definition for that robotClass.
  * @param robotCatalog
  * @param robotClass
  */
export const getRobotDefinitionByRobotClass = (
    robotCatalog: readonly RobotDefinition[] | undefined, robotClass: string | undefined,
): RobotDefinition | undefined => {
    if (robotClass && robotCatalog) {
        return robotCatalog.find((robotDef: RobotDefinition): boolean => {
            return robotDef.robotClass === robotClass;
        });
    }
    return undefined;
};


/**
 * User friendly name for device health condition. These will be used for displaying device's health condition.
 */
export const getRobotHealthConditionName = (status: RobotHealthCondition): string => {
    const HealthStatusNames = Object.freeze({
        [RobotHealthCondition.UNKNOWN] : 'robot_health_condition.unknown',
        [RobotHealthCondition.NORMAL]  : 'robot_health_condition.normal',
        [RobotHealthCondition.MINOR]   : 'robot_health_condition.minor',
        [RobotHealthCondition.WARN]    : 'robot_health_condition.warning',
        [RobotHealthCondition.CRITICAL]: 'robot_health_condition.critical',
    });
    return HealthStatusNames[status] || status.toString();
};



/**
 * Return a time series collection ID based on the robot class and id. For RobotCloud, the collectionId naming convention will be
 * 'rc::${robotClass}:${robotId}::{index}'.
 */
export const getRobotTimeSeriesCollectionId = (robotClass: string, robotId: string, index: string = '0'): string => {
    return `rc::${robotClass}:${robotId}::${index}`;
};


/**
 * Parse robot collection to get the robot's className and ID
 * @param collectionId
 */
export const parseRobotTimeSeriesCollectionId = (collectionId: string): {
    readonly robotClass: string;
    readonly robotId: string;
    readonly index: string;
}| undefined => {
    if (collectionId.startsWith('rc::')) {
        // robotClassAndRobotId = ${robotClass}:${robotId}
        // index = ${index}
        const [robotClassAndRobotId, index] = collectionId.substring(4).split('::');
        if (robotClassAndRobotId && index !== undefined) {
            const [robotClass, robotId] = robotClassAndRobotId.split(':');

            if ([robotClassAndRobotId, index].length === 3) {
                return {
                    robotClass,
                    robotId,
                    index,
                };
            }
        }
    }

    return undefined;
};



/**
 * Given a Metric valueName and robotClass, return a NumericMetricInfo object associated with that valueName from the Robot Definition.
 * @param valueName
 * @param robotClass
 */
export const getRobotNumericMetricInfoObject = (
    robotCatalog: readonly RobotDefinition[] | undefined, valueName: string, robotClass: string | undefined,
): NumericMetricInfo => {
    // Get the robotDef from the catalog the device belonged to. NOTE: this can be undefined if this robot/device
    // does not exist in the catalog
    if (robotClass) {
        const robotDef: RobotDefinition | undefined = getRobotDefinitionByRobotClass(robotCatalog, robotClass);
        if (robotDef) {
            const metric = robotDef.numericMetrics.find((m: NumericMetricInfo) => {
                return m.name === valueName;
            });

            if (metric) {
                return metric;
            }
        }
    }

    // If there isn't a robot spec defined for the robotClass, return a very basic NumericMetricInfo object with only a valueName
    return {
        name: valueName,
    } as NumericMetricInfo;
};


/**
 * Given a Metric tagName and robotClass, return a TagMetricInfo object associated with that tagName from the Robot Definition.
 * @param tagName
 * @param robotClass
 */
export const getRobotTagMetricInfoObject = (
    robotCatalog: readonly RobotDefinition[] | undefined, tagName: string, robotClass: string | undefined,
): TagMetricInfo => {
    // Get the robotDef from the catalog the device belonged to. NOTE: this can be undefined if this robot/device
    // does not exist in the catalog
    if (robotClass) {
        const robotDef: RobotDefinition | undefined = getRobotDefinitionByRobotClass(robotCatalog, robotClass);
        if (robotDef) {
            const metric = robotDef.tagMetrics?.find((m: TagMetricInfo) => {
                return m.name === tagName;
            });

            if (metric) {
                return metric;
            }
        }
    }

    // If there isn't a robot spec defined for the robotClass, return a very basic NumericMetricInfo object with only a valueName
    return {
        name: tagName,
    } as TagMetricInfo;
};



/**
 * Given a list of valueNames, return a list of NumericMetricInfo objects for each value name. Note that this function will also filter out invalid
 * NumericMetricInfo value names, value names that are no longer specified in the robot spec.
 * @param valueNames
 * @param robotClass
 */
export const getRobotNumericMetricInfoObjects = (
    robotCatalog: readonly RobotDefinition[] | undefined, valueNames: readonly string[], robotClass: string,
): readonly NumericMetricInfo[] => {
    // Get the robotDef from the catalog the device belonged to. NOTE: this can be undefined if this robot/device
    // does not exist in the catalog
    const robotDef: RobotDefinition | undefined = getRobotDefinitionByRobotClass(robotCatalog, robotClass);


    // Create a NumericMetricInfo object For each valueName in collectionInfo.valueNames. We need this so that we can display
    // more details for each NumericMetric value such as displayName, units, range, etc...
    // NOTE that valueNames contains metric value name that might no longer be valid so we need to filter out those valueNames.
    // The robotDef should have the most recent list of metric value names so we will use the robot specs to find the list of
    // metrics we need to create, only if robot spec is available. If we don't have a robot spec, we will use everything from
    // value names
    const metrics: readonly NumericMetricInfo[] = sortMetrics(valueNames.filter((valueName: string): boolean => {
        // filter out valueName that are not in robotDef
        return robotDef === undefined || robotDef.numericMetrics.find((metric: NumericMetricInfo) => {
            return metric.name === valueName;
        }) !== undefined;
    }).map((valueName: string): NumericMetricInfo => {
        // For each valid valueName, create a NumericMetricInfo object.
        // First, check if we have Metric type definition from the robotDef. If we do, return the NumericMetricInfo object,
        // If not, create a NumericMetricInfo with only the valueName since we don't know the metric value's units,
        // displayName, etc...
        const metric: NumericMetricInfo | undefined = robotDef ? robotDef.numericMetrics.find((m: NumericMetricInfo) => {
            return m.name === valueName;
        }) : undefined;

        return metric || {
            name: valueName,
        };
    }));

    return metrics;
};



/**
 * Given a list of tag names, return a list of TagMetricInfo objects for each tag name. Note that this function will also filter out invalid
 * TagMetricInfo tag names, tag names that are no longer specified in the robot spec.
 * @param tagNames
 * @param robotClass
 */
export const getRobotTagMetricInfoObjects = (
    robotCatalog: readonly RobotDefinition[] | undefined, tagNames: readonly string[], robotClass: string,
): readonly TagMetricInfo[] => {
    // Get the robotDef from the catalog the device belonged to. NOTE: this can be undefined if this robot/device
    // does not exist in the catalog
    const robotDef: RobotDefinition | undefined = getRobotDefinitionByRobotClass(robotCatalog, robotClass);

    const metrics: readonly TagMetricInfo[] = sortMetrics(tagNames.filter((tagName: string): boolean => {
        // filter out tag name that are not in robotDef
        return robotDef === undefined || robotDef.tagMetrics === undefined || robotDef.tagMetrics.find((metric: TagMetricInfo) => {
            return metric.name === tagName;
        }) !== undefined;
    }).map((tagName: string): TagMetricInfo => {
        // For each valid tagName, create a NumericMetricInfo object.
        // First, check if we have Metric type definition from the robotDef. If we do, return the NumericMetricInfo object,
        // If not, create a NumericMetricInfo with only the tagName since we don't know the metric value's units,
        // displayName, etc...
        const tagMetric: TagMetricInfo | undefined = robotDef && robotDef.tagMetrics ? robotDef.tagMetrics.find((tm: TagMetricInfo) => {
            return tm.name === tagName;
        }) : undefined;

        return tagMetric || {
            name: tagName,
        };
    }));

    return metrics;
};



/**
 * Given a metric valueName and the robotClass that the metric belonged to, return the metric's display name if there is one. If there
 * isn't a displayName, return the metric's valueName.
 *
 * @param robotClass
 * @param valueName
 */
export const getRobotNumericMetricDisplayName = (
    robotCatalog: readonly RobotDefinition[] | undefined, valueName: string, robotClass?: string | undefined,
): string => {
    if (robotClass) {
        // find the metric object from the robotDef that has the same valueName
        const metric = getRobotNumericMetricInfoObject(robotCatalog, valueName, robotClass);

        if (metric && metric.displayName) {
            return metric.displayName;
        }
    }

    return valueName;
};
