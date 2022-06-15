import {
    ThresholdComparisonOperator, TimeSeriesAggregation,
} from '.';


/**
 * The set of severity types that are supported
 */
export enum AlertSeverity {
    HIGH = 1,
    MODERATE = 2,
    LOW = 3,
}


/**
 * For AlertRule's target, we will by default target all entities belonged to an entityClass. However, sometimes we don't want to target all
 * entities of an entityClass but we just want to target a smaller set of entities of that class. Therefore, we will allow the operator
 * to provide a filters to narrow down the target entities.
 */
export enum EntityTarget {
    // Select entities that are children of some specific parents
    PARENTS = 'parents',

    // Select only some specific entities
    ENTITIES = 'entities',
}


/**
 * The set of alert condition types that are supported
 */
export enum AlertConditionType {
    METRIC_HEARTBEAT = 'metricsHeartbeat',
    METRIC_THRESHOLD = 'metricsThreshold',
}


/**
 * To narrow down which entities we want to target
 */
export interface EntityTargetCondition {
    readonly targetBy: EntityTarget;

    // Array of entity IDs with minimum 1 entityId. If 'targetBy' is 'parents', these should be the list of parent entity ids. If
    // 'targetBy' is 'entities', these should be the list of entity ids we want to target
    readonly entityIds: readonly [string, ...string[]];

    // To select the opposite entities specified by the targetBy and entityIds. For example, if "targetBy==parents" and "entitiesIds==['sfo_office']"
    // then we will select all children of entity "sfo_office". However, if "exclude===true", we will select the opposite, select all entities
    // that ARE NOT children of "sfo_office"
    readonly exclude: boolean;
}


/**
 * The condition for creating alerts. For example "severity=LOW" and "operator=lessThan" and "operands=[10]" means
 * to Create an alert with LOW severity when the metric value is lessThan 10.
 */
export interface MetricsAlertConditionThreshold {
    readonly severity: AlertSeverity;
    readonly operator: ThresholdComparisonOperator;
    readonly operands: readonly [number, ...number[]];
}


/**
 * The BASE AlertCondition structure. All Alert Condition types, Threshold and Heartbeat, will require these settings.
 */
export interface AlertCondition {
    readonly conditionType: AlertConditionType;

    // How often to evaluate the condition e.g. "5min", "1hr", etc...
    readonly frequency: string;

    // How long to delay before evaluating the condition e.g. "10min", "45sec", etc...
    readonly delay: string;

    // The period of data to evaluate e.g. "10min", "1hr", etc...
    readonly duration: string;
}


export interface AlertTargetMetric {
    readonly entityClass: string;
    readonly metricsDefinitionId: string;

    // OPTIONAL. Omit means to monitor all metrics in the specified 'metricDefinitionId'.
    // If this is undefined then it is the same as "robotV1.core.*"
    readonly metricName?: string | undefined;

    // OPTIONAL. Omit means to monitor all entities in the specific entityClass.
    // If this is specified then entities specified by this condition will / won't be monitored.
    readonly entityTargetCondition?: EntityTargetCondition | undefined;
}


/**
 * The base structure for the type of alert condition which monitors metrics
 */
export interface MetricsAlertCondition extends AlertCondition {
    readonly conditionType: AlertConditionType.METRIC_HEARTBEAT | AlertConditionType.METRIC_THRESHOLD;

    // Metrics that are monitored.
    readonly targetMetrics: [AlertTargetMetric, ...AlertTargetMetric[]];
}


/**
 * Type guard function to check if an obj is a METRICS alert condition e.g. MetricsHeartbeatAlertCondition or MetricsThresholdAlertCondition.
 */
export const isMetricsAlertCondition = (obj: unknown): obj is MetricsHeartbeatAlertCondition | MetricsThresholdAlertCondition => {
    const condition = obj as AlertCondition;
    return condition && (
        condition.conditionType === AlertConditionType.METRIC_HEARTBEAT || condition.conditionType === AlertConditionType.METRIC_THRESHOLD
    );
};



/**
 * The structure for Heartbeat alert conditions
 */
export interface MetricsHeartbeatAlertCondition extends MetricsAlertCondition {
    // Because this is a Heartbeat alert condition type, the 'conditionType' must be AlertConditionType.METRIC_HEARTBEAT
    readonly conditionType: AlertConditionType.METRIC_HEARTBEAT;

    readonly severity: AlertSeverity;
}


/**
 * Type guard function to check if an obj is a MetricsHeartbeatAlertCondition
 */
export const isMetricsHeartbeatAlertCondition = (obj: unknown): obj is MetricsHeartbeatAlertCondition => {
    const condition = obj as MetricsHeartbeatAlertCondition;
    return condition.conditionType === AlertConditionType.METRIC_HEARTBEAT;
};


/**
 * The structure for Threshold alert conditions
 */
export interface MetricsThresholdAlertCondition extends MetricsAlertCondition {
    // Because this is a Threshold alert condition type, the 'conditionType' must be AlertConditionType.METRIC_THRESHOLD
    readonly conditionType: AlertConditionType.METRIC_THRESHOLD;

    // The aggregation function to use when fetching metric data
    readonly aggregation: TimeSeriesAggregation;

    // Array of MetricsAlertConditionThreshold with minimum 1 MetricsAlertConditionThreshold and maximum N MetricsAlertConditionThreshold
    // where N is the number of Severity types. So if there are 3 severity types, the maximum number of threshold the user can create is 3.
    readonly thresholds: readonly [MetricsAlertConditionThreshold, ...MetricsAlertConditionThreshold[]];
}

/**
 * Type guard function to check if an obj is a MetricsThresholdAlertCondition
 */
export const isMetricsThresholdAlertCondition = (obj: unknown): obj is MetricsThresholdAlertCondition => {
    const condition = obj as MetricsThresholdAlertCondition;
    return condition.conditionType === AlertConditionType.METRIC_THRESHOLD;
};



/**
 * TODO - Define the attributes required for AlertAction
 */
export interface AlertAction {
}


/**
 * The structure for an AlertRule object.
 */
export interface AlertRule {
    readonly id: number;
    readonly projectId: number;
    readonly name: string;
    readonly description?: string | undefined;
    readonly enabled: boolean;
    readonly condition: AlertCondition;
    readonly actions: readonly AlertAction[];
    readonly problem?: string | undefined;
    readonly creationTime: string;
    readonly updateTime: string;
}


/**
 * The structure for a NEW AlertRule object. This structure's attributes is a subset of the attributes defined in AlertRule interface.
 */
export interface CreateAlertRuleParams extends Pick<AlertRule, 'name' | 'description' | 'enabled' | 'condition' | 'actions'> {
}


/**
 * The structure of AlertRule object for editing. This structure's attributes is exactly the same as the CreateAlertRuleParams structure
 * except that all the attributes are optional.
 */
export interface UpdateAlertRuleParams extends Partial<CreateAlertRuleParams> {
}


/**
 * The filter options that the Fetch alert rules API support
 * TODO - Update the set of filters based on what the backend supports
 */
export interface FetchAlertRulesFilters {
    readonly skip?: number | undefined;
    readonly limit?: number | undefined;
    readonly entityClass?: string | undefined;
}



/**
 * Type of alerting states
 */
export enum AlertState {
    ALERTING = 1,
    RECOVERED = 2,
    // an Alert can be OBSOLETE when its Alert Condition is changed while it is in ALERTING state.
    OBSOLETE = 3,
    // an Alert can be INEFFECTIVE when the subject Entity has turned off monitoring while it is in ALERTING state.
    INEFFECTIVE = 4,
}

export interface Alert {
    readonly id: string;

    readonly condition: AlertCondition;

    readonly projectId: number;

    // Alert Status can transition in the following manner:
    // ALERTING -> RECOVERED or INEFFECTIVE or OBSOLETE
    readonly state: AlertState;

    readonly entityId: string;
    readonly description: string;
    readonly severity: AlertSeverity;

    readonly invocationTime: string;
    readonly recoveryTime?: string;
}

export interface MetricAlert extends Alert {
    readonly condition: MetricsAlertCondition;

    // A metric is determined by entityClass, metricsDefinitionId and metricName
    readonly entityClass: string;
    readonly metricsDefinitionId: string;
    readonly metricName: string;
}

export interface MetricThresholdAlert extends MetricAlert {
    readonly condition: MetricsThresholdAlertCondition;
}

export interface MetricHeartbeatAlert extends MetricAlert {
    readonly condition: MetricsHeartbeatAlertCondition;
}

/**
 * The filter options that the Fetch alerts API support
 */
export interface FetchAlertsFilters {
    readonly skip?: number | undefined;
    readonly limit?: number | undefined;
    readonly alertRuleId?: number | undefined;
    readonly entityId?: string | undefined;
    readonly state?: AlertState | undefined;
}
